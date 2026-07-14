import axios from "axios";
import apiEndpoint from "../../config/apiConfig";
import { useSelector } from "react-redux";
import { generateTimestampString } from "../../utils";
import { useCustomFieldEndpoints } from "../../hooks/useCustomFieldEndpoints";
import { useGeneralEndpoints } from "../../hooks/useGeneralEndpoints";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export const useTaskEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const organization_id = useSelector((state) => state.profile.organization_id);
  const { getCustomFields, saveCustomFieldItemValue } =
    useCustomFieldEndpoints();
  const { uploadMedia } = useGeneralEndpoints();
  const headers = {
    Authorization: `token ${token}`,
    "X-OrganizationID": organization_id,
  };

  const createTask = async (projectId, payload) => {
    return axios.post(
      `${apiEndpoint}/crm/tasks/?project_id=${projectId}`,
      payload,
      { headers },
    );
  };

  const getContacts = async () => {
    return axios.get(`${apiEndpoint}/core/organization/contacts/`, { headers });
  };

  const uploadMediaMetaData = async (uploadResponses) => {
    return axios.post(`${apiEndpoint}/core/assets/`, uploadResponses, {
      headers,
    });
  };

  const linkAssetsToTask = async (taskId, payload) => {
    return axios.post(
      `${apiEndpoint}/crm/multitaskassets/?task_id=${taskId}`,
      payload,
      { headers },
    );
  };

  const getPresignedUrls = async (payload) => {
    return axios.post(`${apiEndpoint}/core/presignedurls/`, payload, {
      headers,
    });
  };

  const handleFullTaskCreation = async (fk_project, payload, extras) => {
    const { customFieldValues, selectedMedia, organization_id } = extras;

    // Step A: Create the base task
    const response = await createTask(fk_project, payload);

    if (response.status >= 200 && response.status < 300) {
      const taskId = response.data.result.id;

      // Step B: Save Custom Fields
      if (Object.keys(customFieldValues).length > 0) {
        await Promise.all(
          Object.entries(customFieldValues).map(([fieldId, value]) =>
            saveCustomFieldItemValue(() => {}, fieldId, {
              value,
              context_id: taskId,
            }),
          ),
        );
      }

      // Step C: Handle Media Uploads
      if (selectedMedia.length > 0) {
        const timestampId = new Date().getTime();
        const mediaReqs = selectedMedia.map((m) => ({
          id: `${organization_id}/${fk_project}/${timestampId}${m.name.replace(/\s+/g, "_")}`,
          file_name: `${organization_id}/${fk_project}/${timestampId}${m.name.replace(/\s+/g, "_")}`,
        }));

        const presigned = await getPresignedUrls({
          bucket: "ps-organization-assets",
          data: mediaReqs,
        });
        const uploadMeta = await Promise.all(
          selectedMedia.map(async (m, i) => {
            await prepareFileUpload(m, presigned.data.result[i].url);
            return {
              name: m.name,
              size: m.size || 0,
              type: m.type || "application/octet-stream",
              url: `https://dytjimnn1nskw.cloudfront.net/${mediaReqs[i].file_name}`,
            };
          }),
        );

        const assetRes = await uploadMediaMetaData(uploadMeta);
        await linkAssetsToTask(
          taskId,
          assetRes.data.result.map((a) => ({
            fk_asset: a.id,
            fk_task: taskId,
          })),
        );
      }

      return response;
    }
    throw new Error("Task creation failed at base level");
  };

  const handleAddTask = async (externalPayload) => {
    const {
      fk_project,
      setLoading,
      selectedDate,
      selectedTime,
      note,
      assignee,
      noteTitle,
      taskType,
      cc,
      priority,
      fk_checkpoint,
      customFieldValues,
      selectedMedia,
      showToast = true,
      onRefresh,
    } = externalPayload;
    console.log("In handle add task");
    setLoading((prev) => ({ ...prev, AddTaskFromTasksTab: true }));
    try {
      // build a Date in local time
      const localDue = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
      // compute offset in ms and shift so ISO uses local time as UTC
      const tzOffsetMs = localDue.getTimezoneOffset() * 60000;
      const dueDateIsoForWeb = new Date(
        localDue.getTime() - tzOffsetMs,
      ).toISOString();

      const payload = {
        description: note,
        due_date: dueDateIsoForWeb,
        fk_organization_contact: assignee,
        title: noteTitle,
        status: "ongoing",
        task_type: taskType.id,
        additional_contacts: cc,
        priority: priority.id,
        fk_checkpoint: fk_checkpoint,
      };

      console.log("Payload for adding task:", payload);

      const project_id = fk_project;
      const response = await axios.post(
        `${apiEndpoint}/crm/tasks/?project_id=${project_id}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response data:", response.data);
        const task_id = response.data.result.id;

        const activeFieldIds = customFieldValues.selectedFieldIds || [];

        if (activeFieldIds.length > 0) {
          await Promise.all(
            activeFieldIds.map((fieldId) => {
              const rawValue = customFieldValues[fieldId];

              const stringValue =
                rawValue !== undefined && rawValue !== null
                  ? String(rawValue)
                  : "";

              return saveCustomFieldItemValue(() => {}, fieldId, {
                value: stringValue,
                context_id: task_id,
              });
            }),
          );
        }
        const assetResponse = await uploadMedia(selectedMedia, fk_project);
        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          const folderAssetsPayload = assetResponse.data.result.map(
            (asset) => ({
              fk_asset: asset.id,
              fk_task: task_id,
            }),
          );

          const taskAssetStatusResponse = await axios.post(
            `${apiEndpoint}/crm/multitaskassets/?task_id=${task_id}`,
            folderAssetsPayload,
            {
              headers: {
                Authorization: `token ${token}`,
                "X-OrganizationID": organization_id,
              },
            },
          );

          if (
            taskAssetStatusResponse.status >= 200 &&
            taskAssetStatusResponse.status < 300
          ) {
            if (showToast) {
              Toast.show({
                type: "success",
                text1: "Success",
                text2: "Task added successfully.",
              });
              navigation.pop();
              await onRefresh();
            }
          }
        }
      }
    } catch (error) {
      console.error(
        error.response
          ? "Response error:" + JSON.stringify(error.response.data)
          : error.request
            ? "Network error:" + error.request
            : "Request error:" + error.message,
      );
      if (showToast) {
        Toast.show({
          type: "Error",
          text1: "Error",
          text2:
            error.response?.data?.result ||
            "Failed to add task. Check your network connection.",
        });
      } else {
        throw error;
      }
    } finally {
      setLoading((prev) => ({ ...prev, AddTaskFromTasksTab: false }));
    }
  };

  return {
    createTask,
    getContacts,
    uploadMediaMetaData,
    linkAssetsToTask,
    token,
    organization_id,
    getPresignedUrls,
    handleFullTaskCreation,
    handleAddTask,
  };
};

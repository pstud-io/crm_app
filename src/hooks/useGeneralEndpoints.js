import axios from "axios";
import apiEndpoint from "../config/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { generateTimestampString } from "../utils";
import * as FileSystem from "expo-file-system/legacy";
import { useNavigation } from "@react-navigation/native";
import { api } from "@/api/client";

export const useGeneralEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const selectedProject = useSelector((state) => state.project);
  const profile = useSelector((state) => state.profile);
  const navigation = useNavigation();
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const networkCheckGlobal = useSelector(
    (state) => state.networkCheckGlobal.networkCheckGlobal,
  );
  const dispatch = useDispatch();

  const transcriptionApiUrl = "https://api.projectstudio.ai/core/transcribe/";

  const getAllProjects = async (setLoading, setAllProjects) => {
    console.log("in getAllProjects");
    setLoading((prev) => ({ ...prev, fetchingProjects: true }));
    try {
      const response = await api.get(
        `${apiEndpoint}/customers/project/lite/?organization_contact_id=${organization_contact_id}`,
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Leads fetched successfully:", response.data);
        const titles = response.data.result.map((project) => ({
          project_name: project.project_name,
          id: project.id,
        }));
        setAllProjects(titles);
      }
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading((prev) => ({ ...prev, fetchingProjects: false }));
    }
  };

  const fetchProjectContacts = async (
    projectId,
    setContacts,
    setContactsFetched,
  ) => {
    console.log("fetching contacts for files");
    try {
      const res = await axios.get(
        `${apiEndpoint}/core/contacts/project/?project_id=${projectId}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationId": organization_id,
            "Content-Type": "application/json",
          },
        },
      );
      const formatted = (res.data?.result || []).map((c) => ({
        id: String(c.id),
        name: c.user_details?.name || c.contact_details?.name || "Unnamed",
      }));
      console.log("Fetched contacts:", formatted);
      setContacts(formatted);
      setContactsFetched(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      Alert.alert("Error", `Could not fetch contacts: ${msg}`);
    }
  };

  async function uploadWithConcurrency(
    files,
    presignedUrls,
    concurrency = 3,
    timestampId,
    fk_project,
  ) {
    console.log("In concurrencty", presignedUrls);
    const results = [];
    let index = 0;
    let progress = null;
    async function worker() {
      while (index < files.length) {
        const currentIndex = index++;
        const media = files[currentIndex];
        const presignedUrl = presignedUrls[currentIndex]?.url;

        if (!presignedUrl) {
          throw new Error(`Presigned URL not found for file: ${media.name}`);
        }

        console.log(`Uploading: ${media.name}`);

        const uploadUri = media.relativePath
          ? FileSystem.documentDirectory + media.relativePath
          : media.uri;

        const info = await FileSystem.getInfoAsync(uploadUri);
        console.log("Media uri check", uploadUri);
        console.log("Media info check", info);
        const response = await FileSystem.uploadAsync(presignedUrl, uploadUri, {
          httpMethod: "PUT",
          headers: {
            "Content-Type": media.type || "application/octet-stream",
          },
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Upload failed for ${media.name}`);
        }

        console.log(`Finished: ${media.url}`);

        results.push({
          name: media.name,
          size: media.size || 0,
          type: media.type || "application/octet-stream",
          url: `https://dytjimnn1nskw.cloudfront.net/${organization_id}/${fk_project}/${timestampId}${media.name.replace(/[ •\s]+/g, "_").replace(/\+/g, "_")}`,
        });
      }
    }

    // Create N workers
    const workers = Array.from({ length: concurrency }, () => worker());

    await Promise.all(workers);

    return results;
  }

  const uploadMedia = async (selectedMedia, fk_project) => {
    console.log(
      "fk_project and media in upload media",
      fk_project,
      selectedMedia,
    );
    let progress = null;
    try {
      const timestampId = generateTimestampString();
      // console.log("Timestamp ID:", timestampId);
      progress = "failed after timestamp";
      const mediaUploadRequests = selectedMedia.map((media) => ({
        id: `${organization_id}/${fk_project}/${timestampId}${media.name
          .replace(/[ •\s]+/g, "_")
          .replace(/\+/g, "_")}`,
        file_name: `${organization_id}/${fk_project}/${timestampId}${media.name
          .replace(/[ •\s]+/g, "_")
          .replace(/\+/g, "_")}`,
      }));
      progress = "failed after mediauploadrequests";

      // Step 1: Presigned URLs
      const presignedResponse = await api.post(
        `${apiEndpoint}/core/presignedurls/`,
        {
          bucket: "ps-organization-assets",
          data: mediaUploadRequests,
        },
      );

      progress = `failed after presigned response, ${mediaUploadRequests[0]?.id}`;

      if (presignedResponse.status >= 200 && presignedResponse.status < 300) {
        console.log("Presigned URLs:", presignedResponse.data);

        const uploadResponses = await uploadWithConcurrency(
          selectedMedia,
          presignedResponse.data.result,
          3,
          timestampId,
          fk_project,
        );

        console.log("Uploaded files metadata:", uploadResponses);
        progress = `failed after upload with concurrency, ${uploadResponses[0]?.url}`;

        // Step 3: Add assets in core/assets
        const assetResponse = await api.post(
          `${apiEndpoint}/core/assets/`,
          uploadResponses,
        );
        if (assetResponse.status >= 200 && assetResponse.status < 300) {
          console.log("This is the asset response", assetResponse);
          return assetResponse;
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to Upload media. Check your network connection",
      });
      // Alert.alert("Upload Failed", `${progress}`, [{ text: "OK" }]);
    }
  };

  const getSingleProjectDetails = async (
    loading,
    setLoading,
    setProjectDetails,
  ) => {
    setLoading({ ...loading, fetchingProjectDetails: true });
    if (!selectedProject?.id) return;
    try {
      const response = await axios.get(
        `${apiEndpoint}/customers/project/?project_id=${selectedProject?.id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "response.data.result of get single project details",
          response.data.result,
        );

        if (setProjectDetails) {
          setProjectDetails(response.data.result);
        } else {
          return response.data.result;
        }
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Response error in get single project details:",
          error.response.data,
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to get project details data. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, fetchingProjectDetails: false });
    }
  };

  const getStagesForDropdown = async (setLoading, setAllProjectStages) => {
    // console.log("In getStages fro drompownnnn");
    setLoading((prev) => ({ ...prev, getStagesForDropdown: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/customers/projectstages/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        // console.log("Lead Stages details", response.data.result);
        setAllProjectStages([...response.data.result]);
      }
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch stages. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getStagesForDropdown: false }));
    }
  };

  const getClientDetails = async (
    setLoading,
    setClientDetails,
    setProjectStage,
    project,
  ) => {
    setLoading((prev) => ({ ...prev, getClientDetails: true }));
    console.log("project in get client details", project);
    if (!selectedProject?.id) return;
    const projectToFetchFor = project ?? selectedProject;
    try {
      const response = await axios.get(
        `${apiEndpoint}/customers/project/?project_id=${projectToFetchFor?.id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        // console.log("Client details", response.data.result);
        setClientDetails(response.data.result);
        setProjectStage(response.data.result.project_stage_details.id);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.result
          ? `${error.response?.data?.result} in get clients`
          : "Failed to fetch client details. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getClientDetails: false }));
    }
  };

  const updateStage = async (setLoading, item, project_id) => {
    setLoading((prev) => ({ ...prev, updatingStage: true }));
    console.log("item in update stage", item);
    try {
      const response = await axios.put(
        `${apiEndpoint}/customers/project/?project_id=${project_id}`,
        { fk_project_stage: item.id },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Updated Lead Stage to ${item.name}`,
          visibilityTime: 1500,
          autoHide: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error(
        "Error Updating Stage:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to update stage. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, updatingStage: false }));
      const triggerResponse = await triggerAutomation(() => {}, {
        context_type: "stage_change",
        context_value: item.name,
        project_id: selectedProject?.id,
        sub_workflow_id: null,
      });
      // if (triggerResponse === 1) {
      //   navigation.push("TabNavigator", {
      //     screen: "MoreStack",
      //     params: {
      //       screen: "TasksStack",
      //     },
      //   });
      // }
      // closeProjectInfoBottomSheet();
    }
  };

  const triggerAutomation = async (setLoading, payload) => {
    setLoading(true);
    console.log("Token in dropdown", token);
    try {
      const response = await axios.post(
        `${apiEndpoint}/customers/automation/trigger/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Trigger successful`,
          visibilityTime: 1500,
          autoHide: true,
          position: "top",
        });
        console.log("This is the trigger response", response);
        return response.data.result.triggered_count;
      }
    } catch (error) {
      console.error("Error Trigger", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to trigger automation. Check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationPermissions = async (
    setLoading,
    token,
    organizationID,
  ) => {
    setLoading((prev) => ({ ...prev, fetchingPermissions: true }));
    console.log("Token in getorganization permissions", token);
    console.log(
      "organization id in getorganization permissions",
      organizationID,
    );
    try {
      const response = await axios.get(`${apiEndpoint}/core/organization/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organizationID,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Permissions Response", response.data.result);
        return response.data.result;
      }
    } catch (error) {
      console.error(
        "Error fetching Permissions:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch permissions data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, fetchingPermissions: false }));
    }
  };

  const getApprovalHierarchy = async (loading, setLoading, type) => {
    setLoading({ ...loading, fetchingApprovalHierarchy: true });
    try {
      const response = await axios.get(
        `${apiEndpoint}/core/approval-hirachary/?type=${type}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "response.data.result of get hierarchy",
          response.data.result,
        );
        return response.data.result;
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch approval hierarchy data. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, fetchingApprovalHierarchy: false });
    }
  };

  const handleSendForApproval = async (item, type, hierarchy) => {
    console.log("In send for approval", hierarchy);
    const payload = hierarchy.map((approver, index) => {
      if (approver.approver_type === "role") {
        return {
          context_id: item.id,
          context_type: type,
          fk_user_role: approver.role_details.id,
          level: index + 1,
          project_id: selectedProject?.id,
          remarks: "",
        };
      } else {
        return {
          context_id: item.id,
          context_type: type,
          fk_organisation_contact: approver.organization_contact_details.id,
          level: index + 1,
          project_id: selectedProject?.id,
          remarks: "",
        };
      }
    });
    console.log("Payload of send for approval", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/core/approval-status/multiple/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "response.data.result of sending approval",
          response.data.result,
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to send for approval. Check your network connection.",
      });
    }
  };

  const navigateToContext = async (item) => {
    const {
      context_type,
      context_id,
      comment_context_type,
      comment_context_id,
    } = item;
    if (!context_type || !context_id) return;

    try {
      const headers = {
        Authorization: `token ${token}`,
        "X-OrganizationID": organization_id,
        "Content-Type": "application/json",
      };
      if (context_type === "task") {
        const response = await axios.get(
          `${apiEndpoint}/crm/tasks/solo/?task_id=${context_id}`,
          { headers },
        );
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "TasksStack",
            params: {
              screen: "TaskDetails",
              params: { task: response.data.result },
            },
          },
        });
      } else if (context_type === "activity") {
        console.log("Hitting activity correctly");
        const response = await axios.get(
          `${apiEndpoint}/activity/projectactivity/solo/?project_activity_id=${context_id}`,
          { headers },
        );
        const activity = response.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "ActivitiesStack",
            params: { screen: "ActivityDetails", params: { activity } },
          },
        });
      } else if (context_type === "payment-proof") {
        console.log("Hitting proof correctly");
        const response = await axios.get(
          `${apiEndpoint}/financials/payment-proof/?payment_proof_id=${context_id}`,
          { headers },
        );
        const expense = response.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "RenderExpenseDetails",
            params: { expenseID: expense.id },
          },
        });
      } else if (context_type === "manpower") {
        const response = await axios.get(
          `${apiEndpoint}/manpower/projectmanpower/solo/?manpower_id=${context_id}`,
          { headers },
        );
        const manPower = response.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "ManPowerDetails",
            params: { manPower },
          },
        });
      } else if (context_type === "payment_request") {
        console.log("Hitting correct payment request type");
        const response = await axios.get(
          `${apiEndpoint}/financials/payment-request/solo/?payment_request_id=${context_id}`,
          { headers },
        );
        const reimbursement = response.data.result;
        console.log("Payment Request is", reimbursement);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "RenderPaymentRequestDetails",
            params: { reimbursementID: reimbursement.id },
          },
        });
      } else if (context_type === "finances") {
        console.log("Hitting correct payment request type");
        const response = await axios.get(
          `${apiEndpoint}/financials/payments/solo/?payment_id=${context_id}`,
          { headers },
        );
        const payment = response.data.result;
        console.log("Payment Request is", payment);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "PaymentDetails",
            params: { payment },
          },
        });
      } else if (context_type === "quick_update") {
        console.log("Hitting correct quick update");
        const response = await axios.get(
          `${apiEndpoint}/activity/quickupdates/solo/?quick_update_id=${context_id}`,
          { headers },
        );
        const quickUdpate = response.data.result;
        console.log("Quick Update is", quickUdpate);
        navigation.push("TabNavigator", {
          screen: "ActivitiesStack",
          params: {
            screen: "QuickUpdateDetails",
            params: { quickUdpate, autoOpenComments: false },
          },
        });
      } else if (context_type === "quote") {
        console.log("Hitting correct quote");
        const response = await axios.get(
          `${apiEndpoint}/orders/quotes/solo/?quote_id=${context_id}`,
          { headers },
        );
        const quote = response.data.result;
        console.log("Quote is", quote);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "QuoteDetails",
            params: { quote },
          },
        });
      } else if (context_type === "purchase_request") {
        console.log("Hitting correct quote");
        const response = await axios.get(
          `${apiEndpoint}/materials/purchaserequest/solo/?purchase_request_id=${context_id}`,
          { headers },
        );
        const purchaseRequest = response.data.result;
        console.log("Purchase Request is", purchaseRequest);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "PurchaseRequestDetails",
            params: { purchaseRequest },
          },
        });
      } else if (context_type === "folder") {
        console.log("Hitting correct folder");
        const response = await axios.get(
          `${apiEndpoint}/customers/projectassetgroup/solo/?project_asset_group_id=${context_id}`,
          { headers },
        );
        const folder = response.data.result;
        console.log("Folder is", folder);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "FolderDetails",
            params: { folder },
          },
        });
      } else if (context_type === "inventory") {
        console.log("Hitting correct inventory");
        const response = await axios.get(
          `${apiEndpoint}/materials/inventoryitems/solo/?inventory_item_id=${context_id}`,
          { headers },
        );
        const inventory = response.data.result;
        console.log("Invetory is", inventory);
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "InventoryDetails",
            params: { inventory },
          },
        });
      } else if (context_type === "GRN") {
        console.log("Hitting correct GRN");
        const response = await axios.get(
          `${apiEndpoint}/materials/grn/solo/?grn_id=${context_id}`,
          { headers },
        );
        const GRNItem = response.data.result;
        console.log("GRN is", GRNItem);
        const purchaseRequestResponse = await axios.get(
          `${apiEndpoint}/materials/purchaserequest/solo/?purchase_request_id=${GRNItem.fk_prid}`,
          { headers },
        );
        const purchaseRequest = purchaseRequestResponse.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "GRNDetails",
            params: { GRNItem, purchaseRequest },
          },
        });
      } else if (
        context_type === "comment" &&
        comment_context_type &&
        comment_context_id
      ) {
        console.log(
          "Context type and id",
          comment_context_type,
          comment_context_id,
        );
        if (comment_context_type === "task") {
          const response = await axios.get(
            `${apiEndpoint}/crm/tasks/solo/?task_id=${comment_context_id}`,
            { headers },
          );
          const task = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "TasksStack",
              params: { screen: "TaskDetails", params: { task } },
            },
          });
        } else if (comment_context_type === "activity") {
          const response = await axios.get(
            `${apiEndpoint}/activity/projectactivity/solo/?project_activity_id=${comment_context_id}`,
            { headers },
          );
          const activity = response.data.result;
          console.log("this is the activity", activity);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ActivitiesStack",
              params: { screen: "ActivityDetails", params: { activity } },
            },
          });
        } else if (comment_context_type === "quote") {
          const response = await axios.get(
            `${apiEndpoint}/orders/quotes/solo/?quote_id=${comment_context_id}`,
            { headers },
          );
          const quote = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "QuoteDetails",
              params: { quote },
            },
          });
        } else if (comment_context_type === "manpower") {
          const response = await axios.get(
            `${apiEndpoint}/manpower/projectmanpower/solo/?manpower_id=${comment_context_id}`,
            { headers },
          );
          const manPower = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ManPowerDetails",
              params: { manPower },
            },
          });
        } else if (comment_context_type === "clientProgress") {
          //log url
          console.log(
            `${apiEndpoint}/clientprogress/projectclientprogress/solo/?project_client_progress_id=${comment_context_id}`,
          );
          const response = await axios.get(
            `${apiEndpoint}/clientprogress/projectclientprogress/solo/?project_client_progress_id=${comment_context_id}`,
            { headers },
          );
          const clientProgress = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ClientProgressDetails",
              params: { clientProgress },
            },
          });
        } else if (comment_context_type === "note") {
          const response = await axios.get(
            `${apiEndpoint}/crm/notes/solo/?note_id=${comment_context_id}`,
            { headers },
          );
          const note = response.data.result;

          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "NoteDetails",
              params: { note },
            },
          });
        } else if (comment_context_type === "payment") {
          const response = await axios.get(
            `${apiEndpoint}/financials/payments/solo/?payment_id=${comment_context_id}`,
            { headers },
          );
          const payment = response.data.result;

          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "PaymentDetails",
              params: { payment },
            },
          });
        } else if (comment_context_type === "file") {
          //log url
          console.log(
            "Redirecting to file page",
            `${apiEndpoint}/customers/projectassets/solo/?project_asset_id=${comment_context_id}`,
          );
          const response = await axios.get(
            `${apiEndpoint}/customers/projectassets/solo/?project_asset_id=${comment_context_id}`,
            { headers },
          );
          const fileItem = response.data.result;
          console.log("file item in notifications", fileItem);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ViewFileComments",
              params: { fileID: fileItem?.id },
            },
          });
        } else if (comment_context_type === "checklist") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/checklist/item/?checklist_id=${comment_context_id}`,
            { headers },
          );
          const checklist = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistComments",
              params: { checklist },
            },
          });
        } else if (comment_context_type === "checklistItem") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checklist/item/?checklist_id=${comment_context_id}`,
            { headers },
          );
          const item = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistItemComments",
              params: { item },
            },
          });
        } else if (comment_context_type === "checklistSubItem") {
          //log url
          console.log(
            "The id for subitem",
            comment_context_type,
            comment_context_id,
          );
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checklist/sub-item/?item_id=${comment_context_id}`,
            { headers },
          );
          const subItem = response.data.result;
          console.log("Subitme in notifications", subItem);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistSubItemComments",
              params: { subItem },
            },
          });
        } else if (comment_context_type === "checkpoint") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checkpoint/?checkpoint_id=${comment_context_id}`,
            { headers },
          );
          const checkpoint = response.data.result?.[0];
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "OverviewStack",
              params: {
                screen: "CheckpointDetails",
                params: { checkpointID: checkpoint?.id },
              },
            },
          });
        } else {
          console.warn(
            "❓ Unknown comment_context_type:",
            comment_context_type,
          );
        }
      } else {
        console.log("Navigation context logic hit");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not open details.",
      });
    }
  };

  const transcribeAudio = async (
    uri,
    setIsTranscribing,
    value,
    onChangeText,
  ) => {
    try {
      setIsTranscribing(true);
      // onTranscriptionStart?.();

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const response = await axios.post(transcriptionApiUrl, formData, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.text) {
        const newValue = value?.trim()
          ? value + " " + response.data.text
          : response.data.text;

        onChangeText(newValue);
        // onTranscriptionEnd?.(response.data.text);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Transcription failed";
      Alert.alert("Error", msg);
      // onTranscriptionError?.(msg);
    } finally {
      setIsTranscribing(false);
    }
  };

  const getOrders = async (setLoading, setOrderData) => {
    setLoading((prev) => ({ ...prev, getOrders: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/orders/vendororders/?project_id=${selectedProject?.id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("get order response: ", response.data.result);
        const filteredResult = response.data.result.filter(
          (item) =>
            Array.isArray(item.order_item_details) &&
            item.order_item_details.length > 0,
        );

        console.log("get order response: ", filteredResult);
        setOrderData(filteredResult);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch orders data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getOrders: false }));
    }
  };

  const getOrganizationDetails = async (setLoading, setOrganizationDetails) => {
    setLoading((prev) => ({ ...prev, getOrganizationDetails: true }));
    try {
      const response = await axios.get(`${apiEndpoint}/core/organization/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "get organization details response: ",
          response.data.result,
        );
        setOrganizationDetails(response.data.result);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch organization detials. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getOrganizationDetails: false }));
    }
  };

  const getVendorInvoices = async (setLoading, setVendorInvoices) => {
    setLoading((prev) => ({ ...prev, getVendorInvoices: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/orders/vendor-invoices/?project_id=${selectedProject?.id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("get vendor invoices response: ", response.data.result);
        setVendorInvoices(response.data.result);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch vendor invoices. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getVendorInvoices: false }));
    }
  };

  const getVendors = async (setLoading, setVendors) => {
    setLoading((prev) => ({ ...prev, getVendors: true }));

    try {
      const response = await axios.get(
        `${apiEndpoint}/core/organizationvendors/lite/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("response:", response.data.result);
        const vendorTypes = response.data.result.map((item) => ({
          id: item.fk_organization_vendor,
          name: item.display_name || "Unknown", // Use "Unknown" if name is missing
        }));
        setVendors(vendorTypes);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch vendors data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getVendors: false }));
    }
  };

  const handleApproveRejectApprovals = async (
    setLoading,
    actionType,
    id,
    onRefresh,
  ) => {
    setLoading(true);

    const url = `${apiEndpoint}/core/approval-status/${actionType}/?approval_status_id=${id}`;

    try {
      const response = await axios.put(
        url,
        { status: actionType === "approve" ? "approved" : "rejected" },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Items Updated successfully:", response.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Updated successfully",
        });
        onRefresh();
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.message) {
        console.error("Logic/Code error:", error.message);
      } else {
        console.error("Request error:", error);
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update Purchase Order Item",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModuleCreatorsForFilter = async (
    setLoading,
    setCreatorFilterMethod,
    type,
  ) => {
    setLoading((prev) => ({ ...prev, getModuleCreatorsForFilter: true }));

    try {
      const response = await axios.get(
        `${apiEndpoint}/core/creators/?project_id=${selectedProject?.id}&type=${type}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "response of get creator filter methods before:",
          response.data.result,
        );

        const updatedArray = response.data.result.map((item) => ({
          id: item.subsection.organization_contact_id,
          value: item.subsection.user_name,
        }));
        console.log(
          "response of get creator filter methods after:",
          updatedArray,
        );
        const creatorFilterMethod = [
          {
            id: "fk_org_contact",
            value: "Created By",
            subSections: updatedArray,
          },
        ];
        setCreatorFilterMethod(creatorFilterMethod);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      // return;
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch creators data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getModuleCreatorsForFilter: false }));
    }
  };

  const getPendingApprovals = async (setLoading, setPendingApprovals, type) => {
    setLoading((prev) => ({ ...prev, getPendingApprovals: true }));

    try {
      const response = await axios.get(
        `${apiEndpoint}/core/approval-status/user/?type=${type}&project_id=${""}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );
      if (response.status >= 200 && response.status < 300) {
        console.log("response of get pending results", response.data.result);
        const pendingApprovalsForMe = response.data.result.filter(
          (approval) => {
            const approvals = [...approval.approval_status_details];

            // find MY entry inside approval_status_details
            const myApprovalIndex = approvals.findIndex(
              (item) =>
                item.organization_contact_details?.id ===
                  profile?.organization_contact_id ||
                item.role_details?.id === profile?.fk_user_role,
            );

            // I am not part of this approval chain
            if (myApprovalIndex === -1) return false;

            const myApproval = approvals[myApprovalIndex];

            // my own approval must still be pending
            if (myApproval.status !== "pending") return false;

            // person immediately AFTER me
            const nextApproval = approvals[myApprovalIndex + 1];

            // if no next person -> I am last level -> include
            if (!nextApproval) return true;

            // include only if next person already acted
            return (
              nextApproval.status === "approved" ||
              nextApproval.status === "rejected"
            );
          },
        );
        setPendingApprovals(pendingApprovalsForMe);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch pendidng approvals data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getPendingApprovals: false }));
    }
  };

  return {
    fetchProjectContacts,
    uploadMedia,
    getSingleProjectDetails,
    getStagesForDropdown,
    getClientDetails,
    updateStage,
    getAllProjects,
    getOrganizationPermissions,
    navigateToContext,
    transcribeAudio,
    handleSendForApproval,
    getApprovalHierarchy,
    triggerAutomation,
    getOrders,
    getVendorInvoices,
    getVendors,
    handleApproveRejectApprovals,
    getOrganizationDetails,
    getModuleCreatorsForFilter,
    getPendingApprovals,
  };
};

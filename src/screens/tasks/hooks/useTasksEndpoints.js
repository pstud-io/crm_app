import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import apiEndpoint from "@/config/apiConfig";
import { useNavigation } from "@react-navigation/native";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
export const useTaskEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const project = useSelector((state) => state.project);
  const { triggerAutomation } = useGeneralEndpoints();
  const navigation = useNavigation();
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const getSingleTask = async (loading, setLoading, taskID, setTask) => {
    setLoading({ ...loading, getSingleTask: true });
    console.log("IN get single task");
    try {
      const response = await axios.get(
        `${apiEndpoint}/crm/tasks/solo/?task_id=${taskID}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "Tasks response for get single Task ",
          response.data.result,
        );
        setTask(response.data.result);
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
          "Failed to fetch task details. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, getSingleTask: false });
    }
  };

  const getTaskSummary = async (setTaskCount) => {
    console.log("IN get single task");
    const queryParams = new URLSearchParams();

    if (project?.id !== "all_projects") {
      queryParams.append("fk_project", project?.id);
    } else {
      queryParams.append("project_id", project?.id);
    }
    try {
      const response = await axios.get(
        `${apiEndpoint}/crm/tasks/summary/?${queryParams}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        setTaskCount(response.data.result);
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
          "Failed to fetch task summary. Check your network connection.",
      });
    } finally {
    }
  };

  const getTasks = async (
    newPage,
    searchQuery,
    taskController,
    setLoading,
    setShowLoading,
    tasksData,
    setTasksData,
    setHasMore,
    setPage,
    // setOngoingTasks,
    // setOverdueTasks,
    setCompletedTasks,
    setCreatedTasks,
    setInProgressTasks,
    setOnHoldTasks,
    setDiscardedTasks,
  ) => {
    if (!project) {
      console.warn("No project selected. Tasks cannot be fetched.");
      return;
    }

    const project_id = project.id;
    console.log("Lead ID:", project_id);

    const apiUrl =
      project_id === "all_projects"
        ? `${apiEndpoint}/crm/tasksget/?organization_contact_id=${organization_contact_id}&page=${newPage}&page_size=5&search=${searchQuery}`
        : `${apiEndpoint}/crm/tasksget/?project_id=${project_id}&page=${newPage}&page_size=5&search=${searchQuery}`;

    if (taskController.current) {
      taskController.current.abort();
    }

    // Create new controller for this API call
    const controller = new AbortController();
    taskController.current = controller;

    if (newPage === 1) {
      console.log("setting set show loading true");
      setShowLoading(true);
    } else {
      setLoading((prev) => ({ ...prev, getTasks: true }));
    }

    try {
      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
          signal: controller.signal, // 👈 important (AbortController)
        },
      );

      // Clear controller because request completed successfully
      taskController.current = null;

      if (response.status >= 200 && response.status < 300) {
        const allTasks = response.data.results;

        const updatedTasks =
          newPage === 1 ? allTasks : [...tasksData, ...allTasks];

        setTasksData(updatedTasks);
        setHasMore(response.data.next !== null);
        setPage(newPage);

        // Categorize tasks as before
        // const now = Date.now() + 19800000;

        // const ongoing = [];
        // const overdue = [];
        const completed = [];
        const created = [];
        const inProgress = [];
        const onHold = [];
        const discarded = [];

        for (const task of updatedTasks) {
          // const due = task.due_date ? new Date(task.due_date) : null;
          // const status = task.status;
          const stage = task.stage;

          if (stage === "created") {
            created.push(task);
          } else if (stage === "in_progress") {
            inProgress.push(task);
          } else if (stage === "hold") {
            onHold.push(task);
          } else if (stage === "discarded") {
            discarded.push(task);
          } else if (
            stage === "completed" ||
            stage === "rejected" ||
            stage === "approved"
          ) {
            completed.push(task);
          }

          // if (
          //   status === "completed" ||
          //   status === "rejected" ||
          //   status === "approved"
          // ) {
          //   completed.push(task);
          // } else if (status === "ongoing") {
          //   if (due && due < now) {
          //     overdue.push(task);
          //   } else {
          //     ongoing.push(task);
          //   }
          // }
        }

        setCreatedTasks(created);
        setCompletedTasks(completed);
        setInProgressTasks(inProgress);
        setOnHoldTasks(onHold);
        setDiscardedTasks(discarded);
        // console.log("thise is the ongoing", ongoing);
        // setOngoingTasks(ongoing);
        // setOverdueTasks(overdue);
        // setCompletedTasks(completed);
      }
    } catch (error) {
      // ---------------------------------------------------
      // 🔥 CORRECT CANCELLATION CHECK
      // ---------------------------------------------------
      if (error.code === "ERR_CANCELED") {
        console.log("Tasks request aborted", newPage);
        return;
      }

      console.error("Error loading tasks:", error);

      Toast.show({
        type: "error",
        text1: "Error Loading Tasks",
        text2:
          error.response?.data?.result ||
          "Failed to fetch tasks data. Check your network connection.",
      });
    } finally {
      if (newPage === 1) {
        setShowLoading(false);
      } else {
        setLoading((prev) => ({ ...prev, getTasks: false }));
      }
    }
  };

  const getTasksLite = async (
    loading,
    setLoading,
    setTasksData,
    project_id,
  ) => {
    setLoading({ ...loading, getTasksLite: true });
    const queryParams = new URLSearchParams();

    if (project?.id !== "all_projects" && !project_id) {
      queryParams.append("project_id", project?.id);
    } else {
      queryParams.append("project_id", project_id);
    }

    // queryParams.append("organization_contact_id", organization_contact_id);

    const url = `${apiEndpoint}/crm/tasks/lite/?${queryParams.toString()}`;
    try {
      const response = await axios.post(
        url,
        { assigned: organization_contact_id },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Tasks lite response: ", response.data.result);
        setTasksData(response.data.result);
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
          "Failed to fetch tasks data. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, getTasksLite: false });
    }
  };

  const handleInProgress = async (task, onRefresh) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        {
          stage: "in_progress",
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while marking task as in progress. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("InProgress Successfully");
    }
  };

  const handleHold = async (task, onRefresh) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        {
          stage: "hold",
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while marking task as hold. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("Hold Successfully");
    }
  };

  const handleComplete = async (task, onRefresh) => {
    console.log("CompLeting the task", task);
    const completion_date = new Date().toISOString();
    try {
      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        {
          status: task.task_type === "request" ? "approved" : "completed",
          stage: task.task_type === "request" ? "approved" : "completed",
          completion_date: completion_date,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
        await triggerAutomation(() => {}, {
          context_type: "task_completed",
          project_id: project.id,
          sub_workflow_id: task.next_subworkflow,
        });
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while marking task as complete. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("Task updated successfully");
    }
  };

  const handleReject = async (task, onRefresh) => {
    const completion_date = new Date().toISOString().split("T")[0];

    try {
      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        {
          status: "rejected",
          stage: "rejected",
          completion_date: completion_date,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while rejecting task. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("Rejected Successfully");
    }
  };

  const handleDiscard = async (task, onRefresh) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/crm/tasks/?task_id=${task.id}`,
        {
          stage: "discarded",
        },
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while discarding task. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("Discarded Successfully");
    }
  };

  const updateCustomFieldInPopup = async (id, context_id, value, is_parent) => {
    const urlForParent = `${apiEndpoint}/customers/custom-field-items/?custom_field_item_id=${id}`;
    const urlForOthers = `${apiEndpoint}/customers/custom-field-items/?custom_field_id=${id}`;

    try {
      const payload = {
        context_id: context_id,
        value: value,
      };

      let response;

      if (is_parent) {
        // ✅ UPDATE existing
        response = await axios.put(urlForParent, payload, {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        });
      } else {
        // ✅ CREATE new
        response = await axios.post(urlForOthers, payload, {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        });
      }

      if (response.status >= 200 && response.status < 300) {
        console.log("Success");
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
        position: "bottom",
        text1: "Error",
        text2:
          error?.response?.data?.result ||
          "An error occurred while updating custom field. Check your network connection",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      console.log("Request completed");
    }
  };

  return {
    getSingleTask,
    getTasks,
    handleInProgress,
    handleHold,
    handleComplete,
    handleReject,
    handleDiscard,
    updateCustomFieldInPopup,
    getTaskSummary,
    getTasksLite,
  };
};

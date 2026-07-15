import { useEffect, useState } from "react";
import { fetchTasks } from "../utils/taskEndpoints";
import Toast from "react-native-toast-message";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { GetDataProps } from "@/hooks/usePaginatedSearch";

export type TasksExtraParams = {
  setCompletedTasks: React.Dispatch<React.SetStateAction<any>>;
  setCreatedTasks: React.Dispatch<React.SetStateAction<any>>;
  setInProgressTasks: React.Dispatch<React.SetStateAction<any>>;
  setOnHoldTasks: React.Dispatch<React.SetStateAction<any>>;
  setDiscardedTasks: React.Dispatch<React.SetStateAction<any>>;
  project: ProjectRecord;
  task_type: string;
};

export const useNewTaskEndpoints = () => {
  const [tasksLoading, setTasksLoading] = useState({
    getTasks: false,
    addTask: false,
  });

  const getTasks = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,

    setCompletedTasks,
    setCreatedTasks,
    setInProgressTasks,
    setOnHoldTasks,
    setDiscardedTasks,
    project,
    task_type,
  }: GetDataProps<any> & TasksExtraParams) => {
    if (!hasMore && page !== 1) return;

    setTasksLoading((prev: any) => ({ ...prev, getTasks: true }));
    try {
      const response = await fetchTasks(
        page,
        searchTerm,
        pageSize,
        abortSignal,
        project,
        task_type,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allTasks = response.data.results;

        const updatedTasks = page === 1 ? allTasks : [...data, ...allTasks];

        setData(updatedTasks);
        const hasMore = response.data.next !== null;

        const completed = [];
        const created = [];
        const inProgress = [];
        const onHold = [];
        const discarded = [];
        console.log("Before for loop");
        for (const task of updatedTasks) {
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
        }

        setCreatedTasks(created);
        setCompletedTasks(completed);
        setInProgressTasks(inProgress);
        setOnHoldTasks(onHold);
        setDiscardedTasks(discarded);
        console.log("Before return");
        return { hasMore };
      }
    } catch (error: any) {
      console.error("Error loading tasks:", error);

      Toast.show({
        type: "error",
        text1: "Error Loading Tasks",
        text2:
          error.response?.data?.result ||
          "Failed to fetch tasks data. Check your network connection.",
      });
    } finally {
      setTasksLoading((prev: any) => ({ ...prev, getTasks: false }));
    }
  };

  return { getTasks, tasksLoading };
};

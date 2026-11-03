import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";

type Payload = {
  assigned?: null | string;
  created?: null | string;
  project?: null | string;
  task_type?: null | string;
  stage?: null | string | string[];
  overdue?: boolean;
  due_date_from?: string;
  due_date_to?: string;
};

export const fetchTasks = async (
  page: number,
  searchQuery: string,
  pageSize: number,
  abortSignal: AbortSignal | undefined,
  project: ProjectRecord,
  task_type: string = "",
  showAssignedToMeTasks: boolean,
  showOverdueTasks: boolean,
  activeSubButton: string,
  showSelfCreatedTasks: boolean,
  showDueTodayTasks: boolean,
) => {
  const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
  if (!profile) {
    console.log("Profile is null from fetch tasks");
    return;
  }

  let payload: Payload = {
    assigned: null,
    created: null,
    project: project?.id,
    task_type: task_type,
  };

  if (showAssignedToMeTasks) {
    payload.assigned = profile.organization_contact_id;
  }

  if (showSelfCreatedTasks) {
    payload.created = profile.organization_contact_id;
  }

  if (showOverdueTasks) {
    payload.overdue = true;
  }
  if (showDueTodayTasks) {
    const today = new Date();

    const dueDateFrom = new Date(today);
    dueDateFrom.setHours(0, 0, 0, 0);

    const dueDateTo = new Date(today);
    dueDateTo.setHours(23, 59, 59, 999);

    payload.due_date_from = dueDateFrom.toISOString();
    payload.due_date_to = dueDateTo.toISOString();
  }

  if (activeSubButton) {
    payload.stage =
      activeSubButton === "completed"
        ? ["completed", "approved", "rejected"]
        : activeSubButton;
  }

  const url = `/crm/tasksget/?organization_contact_id=${profile.organization_contact_id}&page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  return await api.post(url, payload, { signal: abortSignal });
};

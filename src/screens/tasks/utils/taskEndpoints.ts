import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";

export const fetchTasks = async (
  page: number,
  searchQuery: string,
  pageSize: number,
  abortSignal: AbortSignal | undefined,
  project: ProjectRecord,
) => {
  const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
  if (!profile) {
    console.log("Profile is null from fetch tasks");
    return;
  }
  let url = "";
  const urlAll = `/crm/tasksget/?organization_contact_id=${profile.organization_contact_id}&page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  const urlSpecific = `/crm/tasksget/?project_id=${project.id}&page=${page}&page_size=5&search=${searchQuery}`;

  if (project.id === "all_projects") {
    url = urlAll;
  } else {
    url = urlSpecific;
  }

  return await api.post(url, {}, { signal: abortSignal });
};

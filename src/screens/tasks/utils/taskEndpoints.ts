import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";

export const fetchTasks = async (page: number, searchQuery: string) => {
  const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
  if (!profile) {
    console.log("Profile is null from fetch tasks");
    return;
  }
  const url = `/crm/tasksget/?organization_contact_id=${profile.organization_contact_id}&page=${page}&page_size=5&search=${searchQuery}`;
  return await api.post(url, {});
};

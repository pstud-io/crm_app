import { api, apiEndpoint } from "@/api/client";
import { storage, StorageKeys } from "./storageFunctions";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";

export const fetchProjects = async (
  newPage: number = 1,
  searchQuery: string = "",
  pageSize: number,
  abortSignal: AbortSignal | undefined,
) => {
  const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
  if (!profile) {
    console.log("Profile is null from fetch projects");
    return;
  }
  const url = `${apiEndpoint}/customers/project/lite/?organization_contact_id=${profile.organization_contact_id}&search=${searchQuery}&page=${newPage}&page_size=${pageSize}`;
  return await api.get(url, {
    signal: abortSignal,
  });
};

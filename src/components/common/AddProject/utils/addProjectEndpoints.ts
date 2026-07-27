import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import { store } from "@/store/store";

export const fetchAllClients = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 6,
  abortSignal: AbortSignal | undefined,
) => {
  const url = `/customers/clients/?page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  console.log("url is", url);

  return await api.get(url, { signal: abortSignal });
};

export const fetchAllAdditionalFields = async () => {
  const url = `/customers/additional-fields/`;
  console.log("url is", url);
  return await api.get(url);
};

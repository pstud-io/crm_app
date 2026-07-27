import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import { store } from "@/store/store";

export type CallHistoryExtraParams = {
  project_id: string;
  task_id: string;
};

export const fetchCallHistory = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 6,
  abortSignal: AbortSignal | undefined,
  callHistoryExtraParams: CallHistoryExtraParams,
) => {
  const url = `/customers/call-history/?project_id=${callHistoryExtraParams.project_id}&task_id=${callHistoryExtraParams.task_id}&page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  console.log("url is", url);

  return await api.get(url, { signal: abortSignal });
};

export const addCallHistory = async (payload: any) => {
  console.log("Payload in add call history", payload);
  const url = `/customers/call-history/`;
  return await api.post(url, payload);
};

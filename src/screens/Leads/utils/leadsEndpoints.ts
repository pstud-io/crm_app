import { api } from "@/api/client";
import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import { KanbanRequestPayload, LeadsRequestPayload } from "../types/leadsTypes";
import { store } from "@/store/store";

export const fetchKanban = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 6,
  abortSignal: AbortSignal | undefined,
  payload: KanbanRequestPayload,
) => {
  const profile = store.getState().profile;
  if (!profile) {
    return;
  }
  let finalPayload = {
    ...payload,
    page: 1,
    organization_contact_id: profile.organization_contact_id,
  };
  const url = `/customers/kanban/initial/?page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  console.log("url is", url);

  return await api.post(url, finalPayload, { signal: abortSignal });
};

export const fetchLeads = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 6,
  abortSignal: AbortSignal | undefined,
  payload: LeadsRequestPayload,
) => {
  const profile = store.getState().profile;
  if (!profile) {
    console.log("Profile is null from fetch tasks");
    return;
  }
  let finalPayload = {
    ...payload,
    page: 1,
    organization_contact_id: profile.organization_contact_id,
  };
  const url = `/customers/kanban/substage/scroll/?page=${page}&page_size=${pageSize}&search=${searchQuery}`;

  return await api.post(url, finalPayload, { signal: abortSignal });
};

export const fetchAllData = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 10,
  abortSignal: AbortSignal | undefined,
) => {
  const url = `/customers/universal-search/?page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  return await api.get(url, { signal: abortSignal });
};

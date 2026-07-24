import { api } from "@/api/client";
import { store } from "@/store/store";

export const fetchNotes = async (
  page: number,
  searchQuery: string = "",
  pageSize: number = 6,
  abortSignal: AbortSignal | undefined,
  project_id: string,
) => {
  const profile = store.getState().profile;
  if (!profile) {
    return;
  }

  const url = `/crm/notes/?project_id=${project_id}&page=${page}&page_size=${pageSize}&search=${searchQuery}`;
  console.log("url is", url);

  return await api.get(url, { signal: abortSignal });
};

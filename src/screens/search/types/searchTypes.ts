export interface Task {
  [key: string]: unknown;
}

export const searchSubButtons = [
  { id: "all", title: "All Data" },
  { id: "leads", title: "Leads" },
  { id: "tasks", title: "Tasks" },
  { id: "notes", title: "Notes" },
  { id: "followups", title: "Follow Ups" },
  { id: "calls", title: "Call History" },
] as const;

export type SubButton<T extends readonly { id: string; title: string }[]> =
  T[number];

export type SubButtonId<T extends readonly { id: string; title: string }[]> =
  SubButton<T>["id"];

export type SubButtonTitle<T extends readonly { id: string; title: string }[]> =
  SubButton<T>["title"];

export type SearchSectionState<T = any> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  loading: boolean;
};

export type UniversalSearchState = {
  project_search: SearchSectionState;
  notes_search: SearchSectionState;
  tasks_search: SearchSectionState;
  followup_search: SearchSectionState;
  call_history_search: SearchSectionState;
};

export interface Task {
  [key: string]: unknown;
}

export const subButtons = [
  { id: "created", title: "Created" },
  { id: "in_progress", title: "In Progress" },
  { id: "hold", title: "Hold" },
  { id: "completed", title: "Completed" },
  { id: "discarded", title: "Discarded" },
] as const;

export type SubButton = (typeof subButtons)[number];
export type SubButtonId = SubButton["id"];
export type SubButtonTitle = SubButton["title"];

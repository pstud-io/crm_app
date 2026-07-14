export const ongoingFilterMethods = [
  {
    id: "due-date",
    value: "Due Date",
    subSections: [
      { id: "today", value: "Today" },
      { id: "tomorrow", value: "Tomorrow" },
      { id: "in-7-days", value: "In 7 Days" },
      { id: "in-14-days", value: "In 14 Days" },
      { id: "after-14-days", value: "After 14 Days" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialOngoingFilterState = {
  "due-date": [],
  type: [],
};

export const ongoingSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialOngoingSortState = ongoingSortMethods[0].id;

export const overdueFilterMethods = [
  {
    id: "due-date",
    value: "Due Date",
    subSections: [
      { id: "today", value: "Today" },
      { id: "yesterday", value: "Yesterday" },
      { id: "in-last-7-days", value: "In Last 7 Days" },
      { id: "in-last-14-days", value: "In Last 14 Days" },
      { id: ">-14-days-ago", value: "> 14 Days ago" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialOverdueFilterState = {
  "due-date": [],
  type: [],
};

export const overdueSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialOverdueSortState = ongoingSortMethods[0].id;

export const completedFilterMethods = [
  {
    id: "completion-date",
    value: "Completed",
    subSections: [
      { id: "on-time", value: "On Time" },
      { id: "late", value: "Late" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialCompletedFilterState = {
  "completion-date": [],
  type: [],
};

export const completedSortMethods = [
  { id: "due-recent", value: "Due Recently" },
  { id: "due-oldest", value: "Due Oldest" },
  { id: "completed-recent", value: "Completed Recently" },
  { id: "completed-oldest", value: "Completed Oldest" },
];

export const initialCompletedSortState = completedSortMethods[0].id;

export const createdFilterMethods = [
  {
    id: "due-date",
    value: "Due Date",
    subSections: [
      { id: "today", value: "Today" },
      { id: "tomorrow", value: "Tomorrow" },
      { id: "in-7-days", value: "In 7 Days" },
      { id: "in-14-days", value: "In 14 Days" },
      { id: "after-14-days", value: "After 14 Days" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialCreatedFilterState = {
  "due-date": [],
  type: [],
};

export const createdSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialCreatedSortState = createdSortMethods[0].id;

export const inProgressFilterMethods = [
  {
    id: "due-date",
    value: "Due Date",
    subSections: [
      { id: "today", value: "Today" },
      { id: "tomorrow", value: "Tomorrow" },
      { id: "in-7-days", value: "In 7 Days" },
      { id: "in-14-days", value: "In 14 Days" },
      { id: "after-14-days", value: "After 14 Days" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialInProgressFilterState = {
  "due-date": [],
  type: [],
};

export const inProgressSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialInProgressSortState = inProgressSortMethods[0].id;

export const onHoldFilterMethods = [
  {
    id: "due-date",
    value: "Due Date",
    subSections: [
      { id: "today", value: "Today" },
      { id: "tomorrow", value: "Tomorrow" },
      { id: "in-7-days", value: "In 7 Days" },
      { id: "in-14-days", value: "In 14 Days" },
      { id: "after-14-days", value: "After 14 Days" },
    ],
  },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialOnHoldFilterState = {
  "due-date": [],
  type: [],
};

export const onHoldSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialOnHoldSortState = onHoldSortMethods[0].id;

export const discardedFilterMethods = [
  // {
  //   id: "due-date",
  //   value: "Due Date",
  //   subSections: [
  //     { id: "today", value: "Today" },
  //     { id: "tomorrow", value: "Tomorrow" },
  //     { id: "in-7-days", value: "In 7 Days" },
  //     { id: "in-14-days", value: "In 14 Days" },
  //     { id: "after-14-days", value: "After 14 Days" },
  //   ],
  // },
  {
    id: "type",
    value: "Type",
    subSections: [
      { id: "task", value: "Task" },
      { id: "request", value: "Request" },
      { id: "hindrance", value: "Hindrance" },
      { id: "followup", value: "Followup" },
      { id: "snags", value: "Snags" },
    ],
  },
];

export const initialDiscardedFilterState = {
  // "due-date": [],
  type: [],
};

export const discardedSortMethods = [
  { id: "recent", value: "Recent" },
  { id: "oldest", value: "Oldest" },
];

export const initialDiscardedSortState = discardedSortMethods[0].id;

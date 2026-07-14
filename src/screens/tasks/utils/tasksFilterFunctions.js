import {
  filterByCompletionDate,
  filterByDueDate,
  filterByType,
  sortByDate,
} from "@/utils/filterFunctions";

export const filterCompletedTasks = (
  completedTasks,
  completedFilterState,
  compeltedSortState,
  setFilteredCompletedTasks,
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  organization_contact_id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  let filteredTasks = [...completedTasks];

  const filter = (key, arr) => {
    if (key === "completion-date") {
      filteredTasks = filterByCompletionDate(
        filteredTasks,
        "due_date",
        "completion_date",
        arr,
      );
    }
    if (key === "type") {
      filteredTasks = filterByType(filteredTasks, "task_type", arr);
    }
  };

  Object.entries(completedFilterState).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0) {
      filter(key, arr);
    }
  });

  let sortedTasks;
  // console.log(
  //   "First time redering in filterCompletedTasks",
  //   compeltedSortState,
  // );
  if (compeltedSortState.includes("due")) {
    if (compeltedSortState.includes("recent")) {
      sortedTasks = sortByDate(filteredTasks, "due_date", "oldest");
    } else {
      sortedTasks = sortByDate(filteredTasks, "due_date", "recent");
    }
  } else if (compeltedSortState.includes("completed")) {
    if (compeltedSortState.includes("recent")) {
      sortedTasks = sortByDate(filteredTasks, "completion_date", "oldest");
    } else {
      sortedTasks = sortByDate(filteredTasks, "completion_date", "recent");
    }
  } else {
    sortedTasks = [...filteredTasks];
    console.error("sorting error");
  }

  const filteredSortedTasks = [
    ...filterByQuickFilters(
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      sortedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    ),
  ];

  setFilteredCompletedTasks(filteredSortedTasks);
};

export const filterCreatedTasks = (
  createdTasks,
  createdFilterState,
  createdSortState,
  setFilteredCreatedTasks,
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  organization_contact_id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  let filteredTasks = [...createdTasks];

  const filter = (key, arr) => {
    if (key === "due-date") {
      filteredTasks = filterByDueDate(filteredTasks, "due_date", arr);
    }
    if (key === "type") {
      filteredTasks = filterByType(filteredTasks, "task_type", arr);
    }
  };

  Object.entries(createdFilterState).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0) {
      filter(key, arr);
    }
  });

  const sortedTasks = sortByDate(filteredTasks, "due_date", createdSortState);

  const filteredSortedTasks = [
    ...filterByQuickFilters(
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      sortedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    ),
  ];

  setFilteredCreatedTasks(filteredSortedTasks);
};

export const filterInProgressTasks = (
  inProgressTasks,
  inProgressFilterState,
  inProgressSortState,
  setFilteredInProgressTasks,
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  organization_contact_id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  let filteredTasks = [...inProgressTasks];

  const filter = (key, arr) => {
    if (key === "due-date") {
      filteredTasks = filterByDueDate(filteredTasks, "due_date", arr);
    }
    if (key === "type") {
      filteredTasks = filterByType(filteredTasks, "task_type", arr);
    }
  };

  Object.entries(inProgressFilterState).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0) {
      filter(key, arr);
    }
  });

  const sortedTasks = sortByDate(
    filteredTasks,
    "due_date",
    inProgressSortState,
  );

  const filteredSortedTasks = [
    ...filterByQuickFilters(
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      sortedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    ),
  ];

  setFilteredInProgressTasks(filteredSortedTasks);
};

export const filterOnHoldTasks = (
  onHoldTasks,
  onHoldFilterState,
  onHoldSortState,
  setFilteredOnHoldTasks,
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  organization_contact_id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  let filteredTasks = [...onHoldTasks];

  const filter = (key, arr) => {
    if (key === "due-date") {
      filteredTasks = filterByDueDate(filteredTasks, "due_date", arr);
    }
    if (key === "type") {
      filteredTasks = filterByType(filteredTasks, "task_type", arr);
    }
  };

  Object.entries(onHoldFilterState).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0) {
      filter(key, arr);
    }
  });

  const sortedTasks = sortByDate(filteredTasks, "due_date", onHoldSortState);

  const filteredSortedTasks = [
    ...filterByQuickFilters(
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      sortedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    ),
  ];

  setFilteredOnHoldTasks(filteredSortedTasks);
};

export const filterDiscardedTasks = (
  discardedTasks,
  discardedFilterState,
  discardedSortState,
  setFilteredDiscardedTasks,
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  organization_contact_id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  let filteredTasks = [...discardedTasks];

  const filter = (key, arr) => {
    if (key === "due-date") {
      filteredTasks = filterByDueDate(filteredTasks, "due_date", arr);
    }
    if (key === "type") {
      filteredTasks = filterByType(filteredTasks, "task_type", arr);
    }
  };

  Object.entries(discardedFilterState).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0) {
      filter(key, arr);
    }
  });

  const sortedTasks = sortByDate(filteredTasks, "due_date", discardedSortState);

  const filteredSortedTasks = [
    ...filterByQuickFilters(
      showOverdueTasks,
      showAssignedToMeTasks,
      showSelfCreatedTasks,
      sortedTasks,
      organization_contact_id,
      overdueOption,
      overdueFromDate,
      overdueToDate,
    ),
  ];

  setFilteredDiscardedTasks(filteredSortedTasks);
};

export const filterByQuickFilters = (
  showOverdueTasks,
  showAssignedToMeTasks,
  showSelfCreatedTasks,
  tasksArray,
  id,
  overdueOption,
  overdueFromDate,
  overdueToDate,
) => {
  // if no filters selected return original array
  if (!showOverdueTasks && !showAssignedToMeTasks && !showSelfCreatedTasks) {
    return tasksArray;
  }

  const currentTime = Date.now() + 19800000;

  return tasksArray.filter((task) => {
    const dueDate = task?.due_date ? new Date(task.due_date).getTime() : null;

    const isTaskClosed =
      task?.stage?.toLowerCase() === "completed" ||
      task?.stage?.toLowerCase() === "approved" ||
      task?.stage?.toLowerCase() === "rejected" ||
      task?.stage?.toLowerCase() === "discarded";

    // basic overdue check
    const isOverdue = dueDate && dueDate < currentTime && !isTaskClosed;

    // overdue filter logic
    let matchesOverdueFilter = isOverdue;

    if (
      showOverdueTasks &&
      overdueOption === "custom" &&
      overdueFromDate &&
      overdueToDate &&
      dueDate
    ) {
      const fromDate = new Date(overdueFromDate);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(overdueToDate);
      toDate.setHours(23, 59, 59, 999);

      matchesOverdueFilter =
        isOverdue &&
        dueDate >= fromDate.getTime() &&
        dueDate <= toDate.getTime();
    }

    const isAssignedToMe = task?.organization_contact_details?.id === id;

    const isSelfCreated = task?.added_by === id;

    // AND condition based on enabled filters
    if (showOverdueTasks && !matchesOverdueFilter) {
      return false;
    }

    if (showAssignedToMeTasks && !isAssignedToMe) {
      return false;
    }

    if (showSelfCreatedTasks && !isSelfCreated) {
      return false;
    }

    return true;
  });
};

import { primaryColors } from "@/design/colors";
import badgeColors from "@/components/UI/Badge/badgeColors";

export function getTaskDisplayStatus(
  status,
  dueDateStr,
  completedDateStr = null,
) {
  const now = new Date();
  const dueDate = new Date(dueDateStr);
  const completedDate = completedDateStr ? new Date(completedDateStr) : null;

  if (status === "discarded") {
    return "Task Discarded";
  }

  if (status === "completed") {
    if (!completedDate) return "Completed date missing";
    return completedDate <= dueDate ? "Done On Time" : "Done Late";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  if (status === "approved") {
    return "Approved";
  }

  if (status === "overdue") {
    const diffMs = now - dueDate;
    const daysOverdue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (daysOverdue < 0) {
      return "Overdue";
    }
    return `${daysOverdue} day(s) overdue`;
  }

  if (
    status === "ongoing" ||
    status === "created" ||
    status === "hold" ||
    status === "in_progress"
  ) {
    const diffMs = dueDate - now;
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${daysLeft} day(s) left`;
  }

  return "Unknown status";
}

export const getStatusColor = (status, dueDateStr, completedDateStr = null) => {
  const dueDate = new Date(dueDateStr);
  const completedDate = completedDateStr ? new Date(completedDateStr) : null;
  let color =
    status === "completed"
      ? completedDate <= dueDate
        ? badgeColors.success
        : badgeColors.orange
      : status === "overdue"
        ? badgeColors.error
        : status === "ongoing" || status === "created" || status === "hold"
          ? badgeColors.purple
          : status === "approved"
            ? badgeColors.success
            : status === "rejected"
              ? badgeColors.error
              : status === "pending" || status === "in_progress"
                ? badgeColors.warning
                : badgeColors.gray;

  return color;
};

export const getTaskTypeColor = (type) => {
  return type.toLowerCase() === "task"
    ? badgeColors.blueLight
    : type.toLowerCase() === "request"
      ? badgeColors.purple
      : type.toLowerCase() === "hindrance"
        ? badgeColors.gray
        : type.toLowerCase() === "followup"
          ? badgeColors.orange
          : badgeColors.rose;
};

export const determineTaskStatusIfRequest = (task_status) => {
  if (task_status === "approved") {
    return "approved";
  } else if (task_status === "rejected") {
    return "rejected";
  }
  return "pending";
};

export const getUpdatedStatus = (status, due_date, task_type, stage) => {
  let updatedStatus = stage;
  const currentDate = Date.now() + 19800000;
  if (due_date && new Date(due_date) < currentDate && stage !== "completed") {
    updatedStatus = "overdue";
  }

  if (task_type === "request") {
    updatedStatus = determineTaskStatusIfRequest(status);
  }

  if (stage === "discarded") {
    updatedStatus = "discarded";
  }

  return updatedStatus;
};

export const returnTasksCount = (
  title,
  filteredCreatedTasks,
  filteredInProgressTasks,
  filteredOnHoldasks,
  filteredCompletedTasks,
  filteredDiscardedTasks,
) => {
  const count =
    title === "Created"
      ? filteredCreatedTasks.length
      : title === "In Progress"
        ? filteredInProgressTasks.length
        : title === "Hold"
          ? filteredOnHoldasks.length
          : title === "Completed"
            ? filteredCompletedTasks.length
            : title === "Discarded"
              ? filteredDiscardedTasks.length
              : 0;
  return count;
};

export const getTaskHistoryStageColor = (stage) => {
  return {
    text: primaryColors.gray[900],
    background: primaryColors.gray[100],
  };
  //   let color =
  //     stage === "created"
  //       ? { text: "#871F78", background: Colors.pale_lavender }
  //       : // { text: "#FF79A7", background: "#FFECF2" }
  //         stage === "in_progress"
  //         ? { text: "#EA9733", background: "#FFF2E7" }
  //         : stage === "hold"
  //           ? { text: "#3E92D6", background: "#E8F3FD" }
  //           : stage === "completed" || stage === "approved"
  //             ? { text: "#66A568", background: "#EBF5EB" }
  //             : stage === "rejected" || stage === "discarded"
  //               ? { text: "#FF79A7", background: "#FFECF2" }
  //               : Colors.gray_text_color;

  //   return color;
};

export const getTaskHistoryStageDisplayText = (stage) => {
  let text =
    stage === "created"
      ? "Created"
      : stage === "in_progress"
        ? "In Progress"
        : stage === "completed"
          ? "Completed"
          : stage === "hold"
            ? "Hold"
            : stage === "approved"
              ? "Approved"
              : stage === "rejected"
                ? "Rejected"
                : stage === "discarded"
                  ? "Discarded"
                  : "---";

  return text;
};

export const getTaskStageColor = (stage) => {
  let color =
    stage === "created"
      ? badgeColors.outline
      : stage === "in_progress"
        ? badgeColors.warning
        : stage === "hold"
          ? badgeColors.blueGray
          : stage === "completed" || stage === "approved"
            ? badgeColors.success
            : stage === "rejected" || stage === "discarded"
              ? badgeColors.error
              : primaryColors.gray[300];

  return color;
};

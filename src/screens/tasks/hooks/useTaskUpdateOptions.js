import { useSelector } from "react-redux";
import {
  CircleCheck,
  DownloadOutlineIcon,
  Hold,
  InProgress,
  Trash,
} from "@/svg";
import { primaryColors } from "@/design/colors";
import { SW } from "@/utils";
import { CircleCancel } from "@/svg";
import { useTaskEndpoints } from "./useTasksEndpoints";

export const useTaskUpdateOptions = ({
  task,
  onShowUserFields,
  onRefresh,
  popoverMenuRef,
  onShowFolloupComplete,
}) => {
  const profile = useSelector((state) => state.profile);
  const is_admin = profile.is_admin;
  const permissions = useSelector(
    (state) => state.permissions.categorizedPermissions,
  );

  const userCanUpdate =
    permissions.customer.includes("customer.can_update_task") || is_admin;

  const taskUpdateOptions = [];

  const checkUserFields = async (originalOnPress) => {
    console.log("This is the task", task);
    // JSON.stringify(task.custom_field_item_details, null, 2),
    // );
    const emptyUserFields = task.custom_field_item_details?.filter(
      (item) => item.custom_field_details?.input_type === "user",
      // && (!item.value || item.value.trim() === ""),
    );

    if (emptyUserFields?.length > 0 && onShowUserFields) {
      await popoverMenuRef.current.requestClose();
      setTimeout(async () => {
        await onShowUserFields(emptyUserFields, originalOnPress);
      }, 250);
    } else {
      if (task.task_type === "followup") {
        console.log("In followup if");
        await popoverMenuRef.current.requestClose();
        setTimeout(async () => {
          await onShowFolloupComplete(task, originalOnPress);
        }, 250);
      } else {
        await originalOnPress();
      }
    }
  };

  const {
    handleInProgress,
    handleHold,
    handleComplete,
    handleReject,
    handleDiscard,
  } = useTaskEndpoints();

  const in_progress = {
    id: "in_progress",
    icon: (
      <InProgress
        width={SW(16)}
        height={SW(16)}
        fill={primaryColors.gray[700]}
      />
    ),
    title: "In Progress",
    onPress: async () => await handleInProgress(task, onRefresh),
  };

  const hold = {
    id: "hold",
    icon: (
      <Hold width={SW(16)} height={SW(16)} fill={primaryColors.gray[700]} />
    ),
    title: "Hold",
    onPress: async () => await handleHold(task, onRefresh),
  };

  const complete = {
    id: "complete",
    icon: (
      <CircleCheck
        width={SW(16)}
        height={SW(16)}
        fill={primaryColors.gray[700]}
      />
    ),
    title: "Complete",
    onPress: async () => {
      checkUserFields(async () => {
        await handleComplete(task, onRefresh);
      });
    },
  };

  const approve = {
    id: "approve",
    icon: (
      <CircleCheck
        width={SW(16)}
        height={SW(16)}
        fill={primaryColors.gray[700]}
      />
    ),
    title: "Approve",
    onPress: async () => await handleComplete(task, onRefresh),
  };

  const reject = {
    id: "reject",
    icon: (
      <CircleCancel
        width={SW(16)}
        height={SW(16)}
        fill={primaryColors.gray[700]}
      />
    ),
    title: "Reject",
    onPress: async () => await handleReject(task, onRefresh),
  };

  const discard = {
    id: "discard",
    icon: (
      <Trash width={SW(16)} height={SW(16)} fill={primaryColors.gray[700]} />
    ),
    title: "Discard",
    onPress: async () => {
      checkUserFields(async () => {
        await handleDiscard(task, onRefresh);
      });
    },
  };

  const stage = task?.stage?.toLowerCase();
  const type = task?.task_type?.toLowerCase();

  if (stage === "created") {
    if (type === "request") {
      taskUpdateOptions.push(hold, approve, reject, discard);
    } else {
      taskUpdateOptions.push(in_progress, hold, complete, discard);
    }
  }

  if (stage === "in_progress") {
    if (type === "request") {
    } else {
      taskUpdateOptions.push(hold, complete, discard);
    }
  }

  if (stage === "hold") {
    if (type === "request") {
      taskUpdateOptions.push(approve, reject, discard);
    } else {
      taskUpdateOptions.push(in_progress, complete, discard);
    }
  }

  return { taskUpdateOptions };
};

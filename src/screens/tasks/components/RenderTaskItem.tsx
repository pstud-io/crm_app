import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  getStatusColor,
  getTaskDisplayStatus,
  getTaskTypeColor,
  getUpdatedStatus,
} from "../utils/taskFunctions";
import { useSelector } from "react-redux";
import { formatAdjustedDate, formatDate } from "@/utils/GeneralFunctions";
import { body } from "@/design/typography";
// import { Badge } from "@/components/UI/Badge/Badge";
import EditIcon from "assets/icons/EditIcon";
import History from "assets/icons/HistoryIcon";

import Popover from "react-native-popover-view";
import Toast from "react-native-toast-message";
import { primaryColors } from "@/design/colors";

const SW = (x) => {
  return x;
};

const SH = (x) => {
  return x;
};

const SF = (x) => {
  return x;
};

export const RenderTaskItem = ({
  task,
  navigation,
  onRefresh,
  hasActionButtons = false,
  fromOverview = true,
}) => {
  const {
    id,
    title,
    creator_contact_details,
    due_date,
    status,
    stage,
    task_type,
    additional_contact_details,
    completion_date,
    project_details,
    description,
    organization_contact_details: {
      owner_details: { name },
    },
  } = task;
  const shouldNavigate = true;
  useEffect(() => {
    console.log("RenderTaskItem mounted");
    return () => console.log("RenderTaskItem unmounted");
  }, []);
  const popoverMenuRef = useRef(null);
  const project = useSelector((state) => state.project);
  const completedStages = ["completed", "approved", "rejected", "discarded"];
  const [expanded, setExpanded] = useState(false);

  const profile = useSelector((state) => state.profile);
  const canEdit =
    profile.is_admin || profile.name === task.creator_contact_details.name;
  const canUpdateTask = !completedStages.includes(stage.toLowerCase());

  const [userFieldsModal, setUserFieldsModal] = useState({
    visible: false,
    fields: [],
    pendingAction: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatedStatus = getUpdatedStatus(status, due_date, task_type, stage);
  const taskTypeColor = getTaskTypeColor(task_type);

  const priorityText = task.priority === "high" ? "🔥" : "";
  const timestamptext =
    task.stage === "in_progress" ? "⏹️" : task.stage === "hold" ? "▶️" : "";

  const handleUserFieldsSubmit = async (values) => {
    setIsSubmitting(true);
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => !key.endsWith("_modal")),
    );
    try {
      // 1. Save Field data
      await Promise.all(
        Object.entries(cleanedValues).map(([itemId, val]) =>
          updateCustomFieldInPopup(itemId, id, val.value, val.is_parent),
        ),
      );

      // 2. Run status change (Complete/Approve/Discard)
      if (userFieldsModal.pendingAction) {
        await userFieldsModal.pendingAction();
      }
      console.log("Run close from handle user fields submit");
      // 3. Clear UI
      setUserFieldsModal({ visible: false, fields: [], pendingAction: null });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Task status updated.",
      });
    } catch (e) {
      console.error(e);
      Toast.show({ type: "error", text1: "Error", text2: "Update failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableOpacity
      key={id}
      disabled={!hasActionButtons}
      onPress={() => {
        if (fromOverview) {
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "TasksStack",
              params: {
                screen: "TaskDetails",
                params: { task },
              },
            },
          });
        }
        if (!fromOverview) {
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "TasksStack",
              params: {
                screen: "TaskDetails",
                params: { task },
              },
            },
          });
        }
      }}
      activeOpacity={0.9}
      style={{
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: SH(16),
        backgroundColor: "white",
        borderRadius: SW(16),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: primaryColors.gray[200],
        // marginBottom: SH(12),
        gap: SH(12),
        elevation: 1,
        shadowColor: "#0A0D12",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      {/* Top Section */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            style={{
              ...body.sm.regular,
              color: primaryColors.gray[700],
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task_type === "snag"
              ? "Snags"
              : task_type.charAt(0).toUpperCase() + task_type.slice(1)}{" "}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: SW(8) }}
          >
            <TouchableOpacity onPress={() => openTaskHistoryBottomSheet(task)}>
              <History
                width={SH(24)}
                height={SH(24)}
                fill={primaryColors.brand[900]}
              />
            </TouchableOpacity>
            {!hasActionButtons && (
              <TouchableOpacity
                onPress={() => {
                  if (fromOverview) {
                    navigation.push("TabNavigator", {
                      screen: "MoreStack",
                      params: {
                        screen: "TasksStack",
                        params: {
                          screen: "EditTask",
                          params: { task, onRefresh },
                        },
                      },
                    });
                  }
                  if (!fromOverview) {
                    navigation.push("TabNavigator", {
                      screen: "MoreStack",
                      params: {
                        screen: "TasksStack",
                        params: {
                          screen: "EditTask",
                          params: { task, onRefresh },
                        },
                      },
                    });
                  }
                }}
              >
                <EditIcon
                  width={SH(20)}
                  height={SH(20)}
                  fill={primaryColors.brand[900]}
                  strokeWidth={0}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: SW(8),
          }}
        >
          <Popover
            key={"TitlePopover"}
            from={
              <TouchableOpacity style={{ flex: 1, paddingBottom: 2 }}>
                <Text
                  style={{
                    ...body.sm.semiBold,
                    color: primaryColors.brand[900],
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title + " " + priorityText}
                </Text>
              </TouchableOpacity>
            }
            placement={"center"}
            popoverStyle={{ borderRadius: SW(8) }}
          >
            <View
              style={{
                ...styles.popoverContent,
                width: SW(300),
                alignItems: "center",
                justifyContent: "center",
                maxHeight: SH(100),
              }}
            >
              <Text style={styles.popoverTitle} numberOfLines={0}>
                {title + " " + priorityText}
              </Text>
            </View>
          </Popover>
          {/* <Badge
            text={getTaskDisplayStatus(
              updatedStatus,
              due_date,
              completion_date,
            )}
            color={getStatusColor(updatedStatus, due_date, completion_date)}
            size={"md"}
          /> */}
        </View>
        {project.id === "all_projects" && project_details?.project_name && (
          <Text
            style={{
              ...body.sm.regular,
              color: primaryColors.brand[900],
            }}
          >
            {project_details.project_name}
          </Text>
        )}
        {/* {project.id === "all_projects" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
                style={{ ...body.xs.regular, color: primaryColors.brand[900] }}
              >
                {project_details.project_name}
              </Text>
            <Badge
              text={getTaskDisplayStatus(
                updatedStatus,
                due_date,
                completion_date
              )}
              color={getStatusColor(updatedStatus, due_date, completion_date)}
              size={"md"}
            />
          </View>
        )} */}
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      {/* Upper Middle Section */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: SW(20),
        }}
      >
        {/* Assigned To */}
        <View
          style={{
            display: "flex",
            gap: SH(8),
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Created By
          </Text>
          <View
            style={{
              flexGrow: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.sm.semiBold,
                color: primaryColors.brand[900],
              }}
            >
              {creator_contact_details?.name || "-"}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            gap: SH(8),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Assigned To
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SW(4),
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                ...body.sm.semiBold,
                color: primaryColors.brand[900],
              }}
            >
              {task?.organization_contact_details?.owner_details?.name}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: SW(20),
        }}
      >
        {/* Assigned To */}
        <View
          style={{
            flex: 1,
            gap: SH(8),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Due Date
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SW(4),
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                ...body.sm.semiBold,
                color: primaryColors.brand[900],
              }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {formatAdjustedDate(due_date)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            gap: SH(8),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Time Spent
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: SW(4),
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                ...body.sm.semiBold,
                color: primaryColors.brand[900],
              }}
            >
              {task.total_hours_in_progress
                ? task?.total_hours_in_progress
                : "---"}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      <View
        style={{
          flex: 1,
          gap: SH(8),
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={{
            ...body.xs.medium,
            color: primaryColors.gray[700],
          }}
        >
          Created On
        </Text>

        <Text
          style={{
            ...body.xs.semiBold,
            color: primaryColors.brand[900],
          }}
        >
          {formatDate(task.created_on)}
        </Text>
      </View>
      {hasActionButtons && (
        <>
          <View
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: "#F2F2F2",
            }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: canEdit ? "space-between" : "flex-end",
              gap: SW(12),
            }}
          >
            {canEdit && (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: SW(12),
                  paddingVertical: SH(8),
                  borderRadius: SW(8),
                  flexGrow: 1,
                  borderWidth: SW(1),
                  borderColor: primaryColors.brand[900],
                  backgroundColor: primaryColors.gray[25],
                }}
                activeOpacity={0.9}
                onPress={() => {
                  if (fromOverview) {
                    navigation.push("TabNavigator", {
                      screen: "MoreStack",
                      params: {
                        screen: "TasksStack",
                        params: {
                          screen: "EditTask",
                          params: { task, onRefresh },
                        },
                      },
                    });
                  }
                  if (!fromOverview) {
                    navigation.push("TabNavigator", {
                      screen: "MoreStack",
                      params: {
                        screen: "TasksStack",
                        params: {
                          screen: "EditTask",
                          params: { task, onRefresh },
                        },
                      },
                    });
                  }
                }}
              >
                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.brand[900],
                  }}
                >
                  Edit Task
                </Text>
              </TouchableOpacity>
            )}
            {canUpdateTask && (
              <>
                {/* <PopoverMenu
                  options={taskUpdateOptions}
                  id={task.id}
                  key={id}
                  popoverMenuRef={popoverMenuRef}
                  from={ */}
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: SW(12),
                    paddingVertical: SH(8),
                    borderRadius: SW(8),
                    flexGrow: 1,
                    backgroundColor: primaryColors.brand[900],
                  }}
                  activeOpacity={0.9}
                >
                  <Text
                    style={{
                      ...body.sm.medium,
                      color: primaryColors.gray[25],
                    }}
                  >
                    Update Task
                  </Text>
                </TouchableOpacity>
                {/* } */}
                {/* /> */}
              </>
            )}
          </View>
        </>
      )}
      {description === null || description === "" || hasActionButtons ? (
        <></>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              borderBottomWidth: SW(1),
              borderBottomColor: "#F2F2F2",
            }}
          />
          <View style={{ gap: SW(4), width: "100%" }}>
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
            >
              Description
            </Text>

            <Text
              style={{
                ...body.sm.semiBold,
                color: primaryColors.brand[900],
              }}
              numberOfLines={expanded ? undefined : 2}
              ellipsizeMode="tail"
              onPress={() => {
                setExpanded(!expanded);
              }}
              suppressHighlighting
            >
              {description}
            </Text>
          </View>
        </>
      )}
      {/* <UserCustomFieldsModal
        visible={userFieldsModal.visible}
        fields={userFieldsModal.fields}
        onClose={() => {
          console.log("MODAL ON CLOSE");
          setUserFieldsModal({
            visible: false,
            fields: [],
            pendingAction: null,
          });
        }}
        onConfirm={handleUserFieldsSubmit}
        loading={isSubmitting}
      /> */}
    </TouchableOpacity>
  );
};

const styles = {
  avatarCircle: {
    width: SW(18),
    height: SW(18),
    borderRadius: SW(9),
    backgroundColor: primaryColors.brand[900],
    justifyContent: "center",
    alignItems: "center",
    marginRight: SW(6),
  },
  avatarText: {
    fontFamily: "Inter-Bold",
    fontSize: SF(10),
    color: "white",
  },
  popoverContent: {
    display: "flex",
    flexDirection: "column",
    width: 200,
    height: 250,
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 8,
    justifyContent: "center",
    alignSelf: "center",
  },
  popoverTitle: {
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  ccItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  ccName: {
    fontFamily: "Inter-Medium",
    fontSize: SF(14),
    color: primaryColors.gray[200],
  },
  separator: {
    height: 12,
  },
  emptyText: {
    fontFamily: "Inter-Medium",
    fontSize: SF(14),
    color: primaryColors.gray[200],
  },
};

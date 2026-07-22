import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  BackHandler,
} from "react-native";
import { Colors, SH, SW, SF } from "../../utils";
import { Button, Spacing } from "../../components/common";
import apiEndpoint from "../../config/apiConfig";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import images from "../../images";
import { TouchableOpacity } from "react-native";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { BackOutlineIcon } from "../../svg";
import Toast from "react-native-toast-message";
import { Badge } from "../../components/UI/Badge/Badge";
import badgeColors from "../../components/UI/Badge/badgeColors";
import { body } from "../../components/UI/DesignSystem/typography";
import { BottomButton } from "../../components/UI/GeneralComponents/BottomButton";
import {
  primaryColors,
  secondaryColors,
} from "../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { Tab } from "../../components/UI/Tab/Tab";
import { SecondaryButton } from "../../components/UI/GeneralComponents/SecondaryButton";
import { SubTabChip } from "../../components/UI/GeneralComponents/SubTabChip";
import { setActiveSubButtonGlobal } from "@/store/slices/activeSubButtonGlobal";

const ListNotifications = ({ route }) => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const project = useSelector((state) => state.project.selectedProject);
  const [loading, setLoading] = useState({
    getNotifications: false,
    markAllRead: false,
    markAsRead: false,
  });
  const [notificationsData, setNotificationsData] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [markingReadId, setMarkingReadId] = useState(null);
  const dispatch = useDispatch();

  const subButtons = [
    { id: "all", title: "All" },
    { id: "unread", title: "Unread" },
    { id: "read", title: "Read" },
  ];
  const [activeSubButton, setActiveSubButton] = useState("all");

  const handleSubButtonPress = (id) => {
    setActiveSubButton(id);
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        getNotifications();
      }
    }, [token, project]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("notifications"));
    }, []),
  );

  useEffect(() => {
    if (!Array.isArray(notificationsData)) {
      setReadNotifications([]);
      setUnreadNotifications([]);
      return;
    }

    const read = [];
    const unread = [];

    for (const item of notificationsData) {
      if (item.read) {
        read.push(item);
      } else {
        unread.push(item);
      }
    }

    setReadNotifications(read);
    setUnreadNotifications(unread);
  }, [notificationsData]);

  const refreshCurrentData = async () => {
    setRefreshing(true);
    await getNotifications();
    setRefreshing(false);
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "task":
        return badgeColors.blueGray;
      case "activity":
        return badgeColors.warning;
      case "payment":
        return badgeColors.success;
      case "note":
        return badgeColors.purple;
      case "manpower":
        return badgeColors.rose;
      default:
        return badgeColors.indigo;
    }
  };

  const NotificationsHeader = () => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );
      return () => backHandler.remove();
    });

    return (
      <View
        style={{
          width: "100%",
          height: SH(60),
          backgroundColor: Colors.theme_background,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: SW(15),
          paddingRight: SW(10),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackOutlineIcon />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: SF(24),
              color: Colors.black_text_color,
              marginLeft: SH(5),
            }}
          >
            Notifications
          </Text>
        </View>
      </View>
    );
  };

  const getNotifications = async () => {
    setLoading({ ...loading, getNotifications: true });
    try {
      const response = await axios.get(`${apiEndpoint}/core/notifications/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setNotificationsData(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading({ ...loading, getNotifications: false });
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      if (!timestamp) return "";
      const cleanedTimestamp = timestamp.split(".")[0] + "Z";
      return formatDistanceToNowStrict(parseISO(cleanedTimestamp), {
        addSuffix: true,
      });
    } catch (err) {
      return "";
    }
  };

  if (loading.getNotifications && notificationsData.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={12} />
      </View>
    );
  }

  const handleNotificationPress = async (item) => {
    if (item.read) {
      navigateToContext(item);
      return;
    }

    setMarkingReadId(item.id);
    try {
      await markAsRead(item.id);
      await navigateToContext(item);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong.",
      });
    } finally {
      setMarkingReadId(null);
    }
  };

  const navigateToContext = async (item) => {
    const {
      context_type,
      context_id,
      comment_context_type,
      comment_context_id,
      project_id,
      project_name,
    } = item;

    if (!context_type || !context_id) return;
    console.log("This is the notification item", item);
    try {
      const headers = {
        Authorization: `token ${token}`,
        "X-OrganizationID": organization_id,
        "Content-Type": "application/json",
      };

      if (context_type === "task") {
        const response = await axios.get(
          `${apiEndpoint}/crm/tasks/solo/?task_id=${context_id}`,
          { headers },
        );
        navigation.push("Tasks", {
          screen: "TaskDetails",
          params: { task: response.data.result },
        });
      } else if (context_type === "activity") {
        const response = await axios.get(
          `${apiEndpoint}/activity/projectactivity/solo/?project_activity_id=${context_id}`,
          { headers },
        );
        const activity = response.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "ActivitiesStack",
            params: { screen: "ActivityDetails", params: { activity } },
          },
        });
      } else if (context_type === "note") {
        const response = await axios.get(
          `${apiEndpoint}/crm/notes/solo/?note_id=${context_id}`,
          { headers },
        );
        const note = response.data.result;
        navigation.push("TabNavigator", {
          screen: "MoreStack",
          params: {
            screen: "NoteDetails",
            params: { note },
          },
        });
      } else if (
        context_type === "comment" &&
        comment_context_type &&
        comment_context_id
      ) {
        console.log(
          "Context type and id",
          comment_context_type,
          comment_context_id,
        );
        if (comment_context_type === "task") {
          const response = await axios.get(
            `${apiEndpoint}/crm/tasks/solo/?task_id=${comment_context_id}`,
            { headers },
          );
          const task = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "TasksStack",
              params: { screen: "TaskDetails", params: { task } },
            },
          });
        } else if (comment_context_type === "activity") {
          const response = await axios.get(
            `${apiEndpoint}/activity/projectactivity/solo/?project_activity_id=${comment_context_id}`,
            { headers },
          );
          const activity = response.data.result;
          console.log("this is the activity", activity);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ActivitiesStack",
              params: { screen: "ActivityDetails", params: { activity } },
            },
          });
        } else if (comment_context_type === "quote") {
          const response = await axios.get(
            `${apiEndpoint}/orders/quotes/solo/?quote_id=${comment_context_id}`,
            { headers },
          );
          const quote = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "QuoteDetails",
              params: { quote },
            },
          });
        } else if (comment_context_type === "manpower") {
          const response = await axios.get(
            `${apiEndpoint}/manpower/projectmanpower/solo/?manpower_id=${comment_context_id}`,
            { headers },
          );
          const manPower = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ManPowerDetails",
              params: { manPower },
            },
          });
        } else if (comment_context_type === "clientProgress") {
          //log url
          console.log(
            `${apiEndpoint}/clientprogress/projectclientprogress/solo/?project_client_progress_id=${comment_context_id}`,
          );
          const response = await axios.get(
            `${apiEndpoint}/clientprogress/projectclientprogress/solo/?project_client_progress_id=${comment_context_id}`,
            { headers },
          );
          const clientProgress = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ClientProgressDetails",
              params: { clientProgress },
            },
          });
        } else if (comment_context_type === "note") {
          const response = await axios.get(
            `${apiEndpoint}/crm/notes/solo/?note_id=${comment_context_id}`,
            { headers },
          );
          const note = response.data.result;

          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "NoteDetails",
              params: { note },
            },
          });
        } else if (comment_context_type === "payment") {
          const response = await axios.get(
            `${apiEndpoint}/financials/payments/solo/?payment_id=${comment_context_id}`,
            { headers },
          );
          const payment = response.data.result;

          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "PaymentDetails",
              params: { payment },
            },
          });
        } else if (comment_context_type === "file") {
          //log url
          console.log(
            "Redirecting to file page",
            `${apiEndpoint}/customers/projectassets/solo/?project_asset_id=${item?.project_asset_id || ""}`,
            item,
          );
          const response = await axios.get(
            `${apiEndpoint}/customers/projectassets/solo/?project_asset_id=${item?.project_asset_id || ""}`,
            { headers },
          );
          const fileItem = response.data.result;
          console.log("file item in notifications", fileItem);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ViewFileComments",
              params: { fileID: fileItem?.id },
            },
          });
        } else if (comment_context_type === "checklist") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/checklist/item/?checklist_id=${comment_context_id}`,
            { headers },
          );
          const checklist = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistComments",
              params: { checklist },
            },
          });
        } else if (comment_context_type === "checklistItem") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checklist/item/?checklist_id=${comment_context_id}`,
            { headers },
          );
          const item = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistItemComments",
              params: { item },
            },
          });
        } else if (comment_context_type === "checklistSubItem") {
          //log url
          console.log(
            "The id for subitem",
            comment_context_type,
            comment_context_id,
          );
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checklist/sub-item/?item_id=${comment_context_id}`,
            { headers },
          );
          const subItem = response.data.result;
          console.log("Subitme in notifications", subItem);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "ChecklistSubItemComments",
              params: { subItem },
            },
          });
        } else if (comment_context_type === "checkpoint") {
          //log url
          const response = await axios.get(
            `${apiEndpoint}/checklists/project-checkpoint/?checkpoint_id=${comment_context_id}`,
            { headers },
          );
          const checkpoint = response.data.result?.[0];
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "OverviewStack",
              params: {
                screen: "CheckpointDetails",
                params: { checkpointID: checkpoint?.id },
              },
            },
          });
        } else if (
          comment_context_type === "payment_request" ||
          comment_context_type === "paymentRequest"
        ) {
          console.log("Hitting correct payment request type");
          const response = await axios.get(
            `${apiEndpoint}/financials/payment-request/solo/?payment_request_id=${comment_context_id}`,
            { headers },
          );
          const reimbursement = response.data.result;
          console.log("Payment Request is", reimbursement);
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "RenderPaymentRequestDetails",
              params: { reimbursementID: reimbursement.id },
            },
          });
        } else if (
          comment_context_type === "expense" ||
          comment_context_type === "payment_expense"
        ) {
          console.log("Hitting proof correctly");
          const response = await axios.get(
            `${apiEndpoint}/financials/payment-proof/?payment_proof_id=${comment_context_id}`,
            { headers },
          );
          const expense = response.data.result;
          navigation.push("TabNavigator", {
            screen: "MoreStack",
            params: {
              screen: "RenderExpenseDetails",
              params: { expenseID: expense.id },
            },
          });
        } else {
          console.warn(
            "❓ Unknown comment_context_type:",
            comment_context_type,
          );
        }
      } else {
        console.log("Navigation context logic hit");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.result || "Count not open details",
      });
    }
  };

  const markAllAsRead = async () => {
    setLoading((prev) => ({ ...prev, markAllRead: true }));
    try {
      await axios.put(
        `${apiEndpoint}/core/notifications/mark-all-read/`,
        {},
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );
      setNotificationsData((prev) =>
        prev.map((item) => ({ ...item, read: true })),
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "All marked as read.",
      });
    } catch (err) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed." });
    } finally {
      setLoading((prev) => ({ ...prev, markAllRead: false }));
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/core/notifications/`,
        [{ id: notificationId, read: true }],
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        setNotificationsData((prev) =>
          prev.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item,
          ),
        );
      }
    } catch (err) {
      console.error("Mark-as-read failed:", err);
    }
  };

  const renderItem = ({ item }) => {
    const badgeType = item.context_type || "Notification";
    const badgeColor = getBadgeColor(item.context_type);
    return (
      <TouchableOpacity
        style={styles.cardContainer(item.read)}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: SW(8),
            }}
          >
            <Badge
              size="sm"
              color={badgeColor}
              border={true}
              text={badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}
            />
            {item.context_type === "comment" && (
              <Badge
                size="sm"
                color={badgeColors.blueGray}
                border={true}
                text={
                  item.comment_context_type.charAt(0).toUpperCase() +
                  item.comment_context_type.slice(1)
                }
              />
            )}
          </View>
          <Text style={styles.timeText}>{getTimeAgo(item.date)}</Text>
        </View>

        {/* Content */}
        <Spacing space={SH(8)} />
        <Text style={styles.headingText} numberOfLines={2} ellipsizeMode="tail">
          {item.heading}
        </Text>
        <Spacing space={SH(6)} />
        <Text style={styles.descText} numberOfLines={3} ellipsizeMode="tail">
          {item.description}
        </Text>

        {!item.read && markingReadId === item.id && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={primaryColors.brand[1000]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#FAFAFA",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginHorizontal: SW(16),
          marginVertical: SH(16),
        }}
      >
        <FlatList
          horizontal
          data={subButtons}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={{ padding: SH(2), flexGrow: 0 }}
          renderItem={({ item, index }) => {
            const isActive = item.id === activeSubButton;
            return (
              <SubTabChip
                index={index}
                title={`${item.title + " " + "(" + (item.id === "all" ? notificationsData.length : item.id === "read" ? readNotifications.length : unreadNotifications.length) + ")"}`}
                type={isActive ? "default" : "outlined"}
                onPress={() => handleSubButtonPress(item.id)}
              />
            );
          }}
          ItemSeparatorComponent={({ leadingItem }) => {
            const isLeadingActive = leadingItem.id === activeSubButton;
            if (isLeadingActive) return null;
            return (
              <View
                style={{
                  width: StyleSheet.hairlineWidth,
                  backgroundColor: Colors.gray_line_color,
                  marginVertical: SH(4),
                  height: "50%",
                  alignSelf: "center",
                }}
              />
            );
          }}
        />
      </View>
      <FlatList
        data={
          activeSubButton === "all"
            ? notificationsData
            : activeSubButton === "read"
              ? readNotifications
              : unreadNotifications
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: SW(16),
        }}
        refreshing={refreshing}
        onRefresh={refreshCurrentData}
        ListEmptyComponent={() =>
          !loading.getNotifications && (
            <View style={{ alignItems: "center", marginTop: SH(20) }}>
              <Text style={styles.emptyText}>No notifications available.</Text>
            </View>
          )
        }
      />
      {notificationsData.length > 0 && (
        <View style={formElementsStyles.bottomButtonContainer}>
          <BottomButton
            title="Mark All as Read"
            onPress={markAllAsRead}
            type={"default"}
          />
        </View>
      )}
      {/* <Toast /> */}
    </View>
  );
};

export default ListNotifications;

const styles = StyleSheet.create({
  cardContainer: (read) => ({
    backgroundColor: read ? Colors.white : secondaryColors.purple[50],
    borderRadius: SW(10),
    borderWidth: SW(1),
    borderColor: primaryColors.gray[200],
    padding: SW(16),
    marginBottom: SH(16),
  }),

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    ...body.xs.regular,
    color: Colors.gray_text_color,
  },
  headingText: {
    ...body.sm.medium,
    color: Colors.black_text_color,
  },
  descText: {
    ...body.xs.regular,
    color: Colors.gray_text_color,
  },
  loadingOverlay: {
    position: "absolute",
    right: SW(10),
    bottom: SH(10),
  },
  emptyText: {
    ...body.sm.medium,
    color: Colors.gray_text_color,
    textAlign: "center",
  },
  bottomButtonContainer: {
    paddingHorizontal: SW(20),
    paddingVertical: SH(15),
    backgroundColor: Colors.theme_background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray_line_color,
  },
});

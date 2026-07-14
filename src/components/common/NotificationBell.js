import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  NotificationOutline,
  NotificationsReadIcon,
  NotificationsUnreadIcon,
} from "../../svg";
import apiEndpoint from "../../config/apiConfig";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { SH, SW, SF } from "../../utils";
import NotificationIcon from "../../svg/notification-bell";

const NotificationBell = React.memo(() => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();

  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const fetchUnreadCount = async () => {
    console.log("In fetch unread count");
    try {
      const response = await axios.get(
        `${apiEndpoint}/core/notifications/unread-count/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );
      //   console.log(
      //     "Unread notifications count:",
      //     response.data.result.unread_notifications_count
      //   );
      if (response.data.result.unread_notifications_count !== unreadCount) {
        setUnreadCount(response.data.result.unread_notifications_count || 0);
      }
    } catch (err) {
      console.error(
        "Failed to fetch unread notifications count:",
        err.response,
      );
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Optional: auto refresh every 1 min
    // const interval = setInterval(fetchUnreadCount, 300000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <>
      {unreadCount > 0 && (
        <View
          style={{
            display: "flex",
            width: unreadCount < 10 ? SH(18) : "auto",
            height: SH(18),
            backgroundColor: primaryColors.brand[1000],
            borderRadius: SH(999),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: SH(10),
            right: unreadCount < 10 ? -SW(12) : -SW(8),
            zIndex: 100,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: SF(8),
              fontWeight: "700",
              fontFamily: "Inter-Regular",
            }}
          >
            {unreadCount}
          </Text>
        </View>
      )}
      <NotificationIcon stroke={primaryColors.brand[1000]} />
      {unreadCount > 0 && (
        <View
          style={{
            display: "flex",
            minWidth: SH(24),
            height: SH(12),
            paddingHorizontal: SW(2),
            backgroundColor: primaryColors.brand[1000],
            borderRadius: SH(999),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: SH(8),
            right: -SW(10),
            zIndex: 100,
            opacity: 0,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: SF(8),
              fontWeight: "700",
              textAlign: "center",
              includeFontPadding: false,
              textAlignVertical: "center",
              fontFamily: "Inter-Regular",
              flexShrink: 0,
            }}
            numberOfLines={1}
          >
            {"222"}
          </Text>
        </View>
      )}
    </>
  );
});

export default NotificationBell;

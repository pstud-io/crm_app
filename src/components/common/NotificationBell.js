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

const NotificationBell = React.memo(({ isFocused }) => {
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
    if (isFocused) {
      fetchUnreadCount();
    }

    // Optional: auto refresh every 1 min
    // const interval = setInterval(fetchUnreadCount, 300000);
    // return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <View
      style={{
        position: "relative",
        alignSelf: "center",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NotificationIcon stroke={primaryColors.brand[1000]} />

      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -SH(0),
            right: -SW(4),

            minWidth: SH(18),
            height: SH(18),
            paddingHorizontal: SW(4),

            backgroundColor: primaryColors.brand[1000],
            borderRadius: SH(999),

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: "#fff",
              fontSize: SF(8),
              fontWeight: "700",
              fontFamily: "Inter-Regular",
              includeFontPadding: false,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
});

export default NotificationBell;

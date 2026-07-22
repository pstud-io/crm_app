import { useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, Linking, Alert } from "react-native";
import { SCREEN_WIDTH, SH, SW } from "../../utils";
import Popover from "react-native-popover-view";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { body } from "../UI/DesignSystem/typography";
import { ProjectInfoCardItem } from "../common/ProjectInfoCardItem";
import PhoneIcon from "../../svg/phone";
import WhatsappIcon from "../../svg/whatsapp";
import { useTheme } from "@/hooks/useTheme";

const CallWhatsappPopover = ({ value, code, fromInfo }) => {
  const { theme } = useTheme();
  const CallWhatsappPopoverRef = useRef(null);
  const handleCall = (phone) => {
    if (!phone || phone === "NA") return;

    const url = `tel:${phone}`;

    Linking.openURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone call not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening dialer", err));
  };
  const handleWhatsapp = async (phone) => {
    try {
      // Phone should include country code without +
      console.log("This is phone", phone);
      const cleanedPhone = phone.replace(/\D/g, "");
      console.log("This is the cleaned phone", cleanedPhone, phone);
      const whatsappUrl = `whatsapp://send?phone=${code}${cleanedPhone}`;
      console.log("This is the whatsapp url", whatsappUrl);
      const supported = await Linking.canOpenURL(whatsappUrl);

      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          "WhatsApp not installed",
          "Please install WhatsApp to send messages.",
        );
      }
    } catch (error) {
      console.error("Error opening WhatsApp", error);
    }
  };
  return (
    <Popover
      backgroundStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      ref={CallWhatsappPopoverRef}
      popoverStyle={{
        backgroundColor: "transparent",
        overflow: "visible",
      }}
      animationConfig={{
        duration: 150,
      }}
      placement="center"
      arrowSize={{ width: 0, height: 0 }}
      offset={0}
      from={
        <TouchableOpacity>
          {fromInfo ? (
            <ProjectInfoCardItem
              label={"Phone"}
              value={value}
              onPress={() => {}}
            />
          ) : (
            <Text
              style={[body.sm.semiBold, { color: theme.text, flexShrink: 1 }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {value}
            </Text>
          )}
        </TouchableOpacity>
      }
    >
      <View
        style={{
          width: SCREEN_WIDTH * 0.66,
          backgroundColor: "white",
          borderRadius: SW(24),
          overflow: "hidden",
        }}
      >
        <View
          style={{
            paddingHorizontal: SW(20),
            paddingVertical: SH(18),
            borderBottomWidth: 1,
            borderBottomColor: primaryColors.gray[200],
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              body.sm.medium,
              {
                color: primaryColors.gray[900],
              },
            ]}
          >
            Contact - {value}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SW(20),
            paddingVertical: SH(18),
            gap: SW(14),
          }}
          onPress={() => {
            handleCall(value);
          }}
        >
          <View
            style={{
              width: SH(32),
              height: SH(32),
              borderRadius: SH(999),
              backgroundColor: primaryColors.gray[50],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PhoneIcon
              stroke={primaryColors.brand[1000]}
              strokeWidth={0}
              fill={primaryColors.brand[1000]}
              width={SH(16)}
              height={SH(16)}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                body.sm.medium,
                {
                  color: primaryColors.gray[900],
                },
              ]}
            >
              Call
            </Text>

            <Text
              style={[
                body.sm.regular,
                {
                  color: primaryColors.gray[400],
                },
              ]}
            >
              Open phone dialer
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            height: 1,
            backgroundColor: primaryColors.gray[100],
            marginLeft: SW(76),
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SW(20),
            paddingVertical: SH(18),
            gap: SW(14),
          }}
          onPress={() => {
            handleWhatsapp(value);
          }}
        >
          <WhatsappIcon width={SH(28)} height={SH(28)} />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                body.sm.medium,
                {
                  color: primaryColors.gray[900],
                },
              ]}
            >
              WhatsApp
            </Text>

            <Text
              style={[
                body.sm.light,
                {
                  color: primaryColors.gray[400],
                },
              ]}
            >
              Send a message
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderTopWidth: 1,
            borderTopColor: primaryColors.gray[200],
            alignItems: "center",
            paddingVertical: SH(16),
            backgroundColor: primaryColors.gray[50],
          }}
          onPress={() => {
            CallWhatsappPopoverRef.current?.requestClose?.();
          }}
        >
          <Text
            style={[
              body.sm.medium,
              {
                color: primaryColors.gray[600],
              },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Popover>
  );
};

export default CallWhatsappPopover;

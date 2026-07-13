import React from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { BottomButton } from "../BottomButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ConfirmationPopover = ({
  visible,
  title,
  message,
  onOkayPress,
  onCancelPress,
  renderCancelButton,
  loading,
  okayButtonTitle = "Okay",
  cancelButtonTitle = "Cancel",
  type = "default", 
}) => {
  return (
    <Popover
      isVisible={visible}
      onRequestClose={onCancelPress}
      animationConfig={{ duration: 250, useNativeDriver: true }}
      backgroundStyle={styles.backdrop}
      popoverStyle={styles.popoverContainer}
    >
      <View style={styles.innerContent}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Body Section */}
        <View style={styles.bodyPadding}>
          <Text style={styles.messageText}>{message}</Text>

          <View style={styles.bottomButtonContainer}>
            {renderCancelButton && (
              <BottomButton
                title={cancelButtonTitle}
                onPress={onCancelPress}
                 type={type === "danger" ? "rejectOutlined" : "default"}
                style={styles.flexButton}
                disabled={loading}
              />
            )}
            <BottomButton
              title={loading ? "Processing..." : okayButtonTitle}
              onPress={onOkayPress}
              type={type === "danger" ? "rejectDefault" : "default"}
              disabled={loading}
              icon={loading && <ActivityIndicator size={12} color={Colors.white} />}
              style={styles.flexButton}
            />
          </View>
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.85,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: {
    width: "100%",
  },
  headerRow: {
    paddingHorizontal: SW(20),
    paddingVertical: SH(16),
    backgroundColor: primaryColors.gray[25],
    borderBottomWidth: 1,
    borderBottomColor: primaryColors.gray[100],
    alignItems: 'center',
  },
  headerTitle: {
    ...body.md.bold,
    color: primaryColors.gray[900],
    textAlign: 'center',
  },
  bodyPadding: {
    padding: SW(20),
  },
  messageText: {
    ...body.sm.regular,
    color: primaryColors.gray[600],
    textAlign: 'center',
    lineHeight: SH(22),
    marginBottom: SH(24),
  },
  bottomButtonContainer: {
    flexDirection: "row",
    gap: SW(12),
  },
  flexButton: {
    flex: 1,
  },
});

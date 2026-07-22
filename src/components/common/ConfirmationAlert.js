import React from "react";
import { Modal, Text, View, StyleSheet } from "react-native";
import { Colors, SH, SW, SF } from "../../utils";
import { Button } from "../Button";
import { body } from "../UI/DesignSystem/typography";

const ConfirmationAlert = ({
  visible,
  title,
  message,
  onOkayPress,
  onCancelPress,
  renderCancelButton,
  requestPickupModal,
  loading,
}) => {
  return (
    <Modal
      //   style={{ backgroundColor: "#000000" }}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={renderCancelButton ? onCancelPress : onOkayPress} //The `onRequestClose` callback is called when the user taps the hardware back button on Android or the menu button on Apple TV.
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            requestPickupModal && styles.requestPickupModalView,
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              requestPickupModal && styles.requestPickupModalTitle,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.modalMessage,
              requestPickupModal && styles.requestPickupModalMessage,
            ]}
          >
            {message}
          </Text>
          <View
            style={[
              styles.buttonsView,
              requestPickupModal && styles.requestbuttonsView,
              { gap: 16 },
            ]}
          >
            {renderCancelButton && (
              <Button label="Cancel" onPress={onCancelPress} themeInverse />
            )}
            <Button
              label={requestPickupModal ? "Confirm" : "Log Out"}
              onPress={onOkayPress}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: Colors.theme_background,
    borderRadius: 10,
    padding: SW(20),
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    ...body.xxl.semiBold,
    marginBottom: SH(10),
    textAlign: "center",
    color: Colors.primary,
  },
  modalMessage: {
    ...body.lg.regular,
    marginBottom: SH(20),
    textAlign: "center",
    color: Colors.gray_text_color,
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "center",

    borderWidth: 0,
    width: "100%",
  },
  okayButton: {
    paddingHorizontal: SW(12),
    minWidth: SW(80),
  },
  cancelButton: {
    paddingHorizontal: SW(12),
    backgroundColor: Colors.gray_line_color,
    minWidth: SW(80),
  },
  requestPickupModalView: {
    backgroundColor: Colors.theme_background,
    borderRadius: 10,
    padding: SW(20),
    width: "90%",
    alignItems: "flex-start",
  },
  requestPickupModalTitle: {
    ...body.md.regular,
    marginBottom: SH(10),
    textAlign: "left",
    color: Colors.dark_gray_text_color,
  },
  requestPickupModalMessage: {
    ...body.sm.regular,
    marginBottom: SH(20),
    textAlign: "left",
    color: Colors.black_text_color,
  },
  requestbuttonsView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderWidth: 0,
    width: "100%",
  },
});

export default ConfirmationAlert;

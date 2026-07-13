import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import { CloseOutlineIcon, TickOutline } from "../../../../svg";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AddCustomFieldPopup = ({ visible, onClose, onAdd }) => {
  const [fieldName, setFieldName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!fieldName.trim()) {
      return Toast.show({
        type: "error",
        text1: "Required",
        text2: "Please enter a Field Name",
      });
    }

    setLoading(true);
    const newField = {
      label: fieldName.trim(),
      placeholder: placeholder.trim() || `Enter ${fieldName.trim()}`,
      isMandatory: isMandatory,
    };

    try {
      await onAdd(newField);
      setFieldName("");
      setPlaceholder("");
      setIsMandatory(false);
      onClose();
    } catch (error) {
      console.error("Failed to add field", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover
      isVisible={visible}
      onRequestClose={onClose}
      animationConfig={{ duration: 250, useNativeDriver: true }}
      backgroundStyle={styles.backdrop}
      popoverStyle={styles.popoverContainer}
    >
      <View style={styles.innerContent}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Add Custom Field</Text>
          <TouchableOpacity onPress={onClose}>
            <CloseOutlineIcon
              fill={primaryColors.gray[400]}
              width={SW(18)}
              height={SH(18)}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bodyPadding}>
          {/* Field Name Input */}
          <Text style={styles.label}>Field Name *</Text>
          <Spacing space={SH(8)} />
          <TextInput
            placeholder="e.g. Serial Number, Brand"
            placeholderTextColor={primaryColors.gray[400]}
            value={fieldName}
            onChangeText={setFieldName}
            style={styles.inputField}
          />

          <Spacing space={SH(20)} />

          {/* Custom Placeholder (Optional) */}
          <Text style={styles.label}>Custom Placeholder (Optional)</Text>
          <Spacing space={SH(8)} />
          <TextInput
            placeholder={`Default: Enter ${fieldName || "value"}`}
            placeholderTextColor={primaryColors.gray[400]}
            value={placeholder}
            onChangeText={setPlaceholder}
            style={styles.inputField}
          />

          <Spacing space={SH(20)} />

          {/* Toggle for Mandatory */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsMandatory(!isMandatory)}
          >
            <View
              style={[styles.checkbox, isMandatory && styles.checkboxActive]}
            >
              {isMandatory && (
                <TickOutline
                  width={SH(16)}
                  height={SH(16)}
                  stroke={Colors.white}
                  strokeWidth={3}
                />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Make this field mandatory</Text>
          </TouchableOpacity>

          <Spacing space={SH(32)} />

          <View style={styles.bottomButtonContainer}>
            <BottomButton
              title="Cancel"
              onPress={onClose}
              type="outlined"
              style={styles.flexButton}
            />
            <BottomButton
              title="Add Field"
              onPress={handleConfirm}
              type="default"
              disabled={loading}
              icon={
                loading && <ActivityIndicator size={12} color={Colors.white} />
              }
              style={styles.flexButton}
            />
          </View>
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: { width: "100%" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(16),
    backgroundColor: primaryColors.gray[25],
    borderBottomWidth: 1,
    borderBottomColor: primaryColors.gray[100],
  },
  headerTitle: { ...body.md.bold, color: primaryColors.gray[900] },
  bodyPadding: { padding: SW(20) },
  label: { ...body.xs.medium, color: primaryColors.gray[600] },
  inputField: {
    height: SH(44),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    borderRadius: SW(8),
    paddingHorizontal: SW(12),
    ...body.sm.regular,
    color: primaryColors.gray[900],
    backgroundColor: primaryColors.gray[50],
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: SW(20),
    height: SW(20),
    borderRadius: SW(6),
    borderWidth: 1.5,
    borderColor: primaryColors.gray[300],
    marginRight: SW(10),
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: primaryColors.gray[600],
    borderColor: primaryColors.gray[600],
  },
  checkboxLabel: { ...body.sm.regular, color: primaryColors.gray[700] },
  bottomButtonContainer: { flexDirection: "row", gap: SW(12) },
  flexButton: { flex: 1 },
});

export default AddCustomFieldPopup;

import React, { useState } from "react"; // Added useState
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { SH, SW } from "../../../utils";
import { body as typography } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";
import { Spacing } from "../../common";
import { DatePicker2 } from "./DatePicker2";
import SelectionPopover from "./PopUps/SelectionPopover";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { Checkbox, DownArrowOutlineIcon } from "../../../svg";

export const CustomFiledEditVersion = ({
  customFields = [],
  formValues = {},
  setFormValues,
}) => {
  const [openPickerId, setOpenPickerId] = useState(null);

  const handleUpdate = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const renderFieldInput = (field) => {
    const currentValue = formValues[field.id];

    if (field.input_type === "user") {
      return (
        <View style={[formElementsStyles.triggerStyle, styles.disabledField]}>
          <Text
            style={[
              formElementsStyles.valueStyle,
              { color: primaryColors.gray[400] },
            ]}
          >
            {currentValue || "Value will be added after Completion/Discard"}
          </Text>
        </View>
      );
    }

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextInput
            placeholder={`Enter ${field.name}`}
            placeholderTextColor={primaryColors.gray[400]}
            keyboardType={field.type === "text" ? "default" : "numeric"}
            style={[formElementsStyles.triggerStyle, styles.inputField]}
            value={currentValue?.toString() || ""}
            onChangeText={(val) => handleUpdate(field.id, val)}
          />
        );
      case "date":
        return (
          <DatePicker2
            selectedDate={currentValue ? new Date(currentValue) : null}
            setSelectedDate={(date) => {
              handleUpdate(field.id, date.toISOString());
              setOpenPickerId(null);
            }}
            showDatePicker={openPickerId === field.id}
            setShowDatePicker={(isOpen) =>
              setOpenPickerId(isOpen ? field.id : null)
            }
            placeholder="Select Date"
          />
        );
      case "checkbox":
        const isChecked = currentValue === true || currentValue === "true";
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.checkboxContainer, { alignSelf: "flex-start" }]}
            onPress={() => handleUpdate(field.id, !isChecked)}
          >
            <Checkbox
              isSelected={isChecked}
              width={SW(20)}
              height={SH(20)}
              stroke={primaryColors.gray[300]}
            />
          </TouchableOpacity>
        );
      case "select":
        const selectOptions = (field.select_options || []).map((opt) => ({
          id: opt,
          name: opt,
        }));
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              formElementsStyles.triggerStyle,
              styles.selectTrigger,
              { flexDirection: "row" },
            ]}
            onPress={() => handleUpdate(`${field.id}_modal`, true)}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !currentValue && { color: primaryColors.gray[400] },
                styles.flexText,
              ]}
              numberOfLines={1}
            >
              {currentValue || `Select ${field.name}`}
            </Text>
            <DownArrowOutlineIcon
              width={SH(16)}
              height={SH(16)}
              color={primaryColors.button.active}
            />
            <SelectionPopover
              visible={formValues[`${field.id}_modal`]}
              onClose={() => handleUpdate(`${field.id}_modal`, false)}
              title={field.name}
              data={selectOptions}
              selectedIds={currentValue}
              onConfirm={(selected) => {
                handleUpdate(field.id, selected);
                handleUpdate(`${field.id}_modal`, false);
              }}
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (!customFields || customFields.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={styles.container}
    >
      <Text style={styles.sectionTitle}>Additional Fields</Text>
      <Spacing space={SH(12)} />

      {customFields.map((field) => (
        <View key={field.id} style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>{field.name}</Text>
          <Spacing space={SH(6)} />
          {renderFieldInput(field)}
          <Spacing space={SH(16)} />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  sectionTitle: {
    ...typography.md.bold,
    color: primaryColors.gray[600],
    includeFontPadding: false,
  },
  fieldWrapper: { width: "100%" },
  fieldLabel: {
    ...typography.sm.medium,
    color: primaryColors.gray[700],
    includeFontPadding: false,
  },
  inputField: {
    ...typography.sm.regular,
    color: primaryColors.gray[900],
    includeFontPadding: false,
    height: SH(44),
  },
  disabledField: {
    backgroundColor: primaryColors.gray[50],
    borderColor: primaryColors.gray[200],
    justifyContent: "center",
  },
  flexInput: { flex: 1, height: "100%" },
  flexText: { includeFontPadding: false, flex: 1 },
  percentageContainer: { alignItems: "center" },
  percentageSign: {
    ...typography.sm.medium,
    color: primaryColors.gray[500],
    includeFontPadding: false,
    paddingHorizontal: SW(8),
  },
  selectTrigger: { alignItems: "center", height: SH(44) },
  checkboxContainer: { paddingVertical: SH(4) },
});

import React, { useState, useMemo } from "react";
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
import {
  Checkbox,
  DownArrowOutlineIcon,
  AddOutlineIcon,
  CloseOutlineIcon,
} from "../../../svg";

export const CustomFieldsRenderer = ({
  customFields = [], // All available fields from API
  formValues = {}, // Current values and selected field state
  setFormValues,
}) => {
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [openPickerId, setOpenPickerId] = useState(null);

  // 1. Logic to identify which fields the user has actually "Added" to the view
  const selectedFieldIds = useMemo(() => {
    return formValues.selectedFieldIds || [];
  }, [formValues.selectedFieldIds]);

  // 2. Prepare data for the Multi-Select Popover with the requested naming logic
  const pickerData = useMemo(() => {
    return customFields.map((field) => {
      const suffix = field.input_type === "form" ? "(form)" : "(assignee)";
      return {
        id: field.id,
        name: `${field.name} ${suffix}`,
      };
    });
  }, [customFields]);

  const handleUpdate = (fieldId, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const toggleFieldSelection = (ids) => {
    setFormValues((prev) => ({
      ...prev,
      selectedFieldIds: ids,
    }));
  };

  const removeField = (id) => {
    setFormValues((prev) => {
      // 1. Create a copy of the previous state
      const nextValues = { ...prev };

      // 2. Filter out the ID from the selected list
      const updatedIds = (prev.selectedFieldIds || []).filter(
        (fieldId) => fieldId !== id,
      );
      nextValues.selectedFieldIds = updatedIds;

      // 3. Delete the actual data/value associated with this field
      delete nextValues[id];

      // 4. Return the new object to trigger a re-render
      return nextValues;
    });
  };

  const renderFieldInput = (field) => {
    const currentValue = formValues[field.id];

    // If input_type is 'user', the user cannot edit. Just show a placeholder/label.
    if (field.input_type === "user") {
      return (
        <View style={[formElementsStyles.triggerStyle, styles.disabledField]}>
          <Text
            style={[
              formElementsStyles.valueStyle,
              { color: primaryColors.gray[400] },
            ]}
          >
            Value will be added after completion/discard
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
      case "percentage":
        return (
          <View
            style={[
              formElementsStyles.triggerStyle,
              styles.percentageContainer,
              { flexDirection: "row" },
            ]}
          >
            <TextInput
              placeholder={`Enter ${field.name}`}
              placeholderTextColor={primaryColors.gray[400]}
              keyboardType="numeric"
              style={[
                styles.inputField,
                styles.flexInput,
                { borderBottomWidth: 0 },
              ]}
              value={currentValue?.toString() || ""}
              onChangeText={(val) => handleUpdate(field.id, val)}
            />
            <Text style={styles.percentageSign}>% </Text>
          </View>
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
              onConfirm={(selected) => handleUpdate(field.id, selected)}
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
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() => setShowFieldPicker(true)}
      >
        <Text style={styles.sectionTitle}>Additional Fields</Text>
        <AddOutlineIcon
          width={SW(20)}
          height={SH(20)}
          fill={primaryColors.gray[600]}
        />
      </TouchableOpacity>

      <Spacing space={SH(12)} />

      {customFields
        .filter((f) => selectedFieldIds.includes(f.id))
        .map((field) => (
          <View key={field.id} style={styles.fieldWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>{field.name}</Text>
              <TouchableOpacity
                onPress={() => removeField(field.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseOutlineIcon
                  width={SW(14)}
                  height={SH(14)}
                  fill={primaryColors.error[600]}
                />
              </TouchableOpacity>
            </View>
            <Spacing space={SH(6)} />
            {renderFieldInput(field)}
            <Spacing space={SH(16)} />
          </View>
        ))}

      <SelectionPopover
        visible={showFieldPicker}
        title="Select Additional Fields"
        isMultiSelect={true}
        data={pickerData}
        selectedIds={selectedFieldIds}
        onClose={() => setShowFieldPicker(false)}
        onConfirm={(ids) => {
          toggleFieldSelection(ids);
          setShowFieldPicker(false);
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  headerRow: {
    flexDirection: "row",
    gap: SW(8),
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.md.bold,
    color: primaryColors.gray[600],
    includeFontPadding: false,
  },
  fieldWrapper: { width: "100%" },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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

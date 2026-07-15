import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { SW, SH, newDateToYYYYMMDD, dateToYYYYMMDD } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import {
  CloseOutlineIcon,
  Checkbox,
  DownArrowOutlineIcon,
} from "../../../../svg";
import SelectionPopover from "./SelectionPopover";
import { formElementsStyles } from "../../Dropdown/formElementStyles";
import Toast from "react-native-toast-message";
import { DatePicker2 } from "../DatePicker2";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const UserCustomFieldsModal = ({
  visible,
  fields,
  onClose,
  onConfirm,
  loading,
}) => {
  const [values, setValues] = useState({});
  const [openPickerId, setOpenPickerId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!visible) {
        setValues({});
        return;
      }
    };

    fetchData();
  }, [visible]);

  const clearChildValues = (field, values) => {
    const subFields =
      field?.custom_field_details?.sub_fields || field?.sub_fields;

    subFields.forEach((sf) => {
      delete values[sf.id];
      delete values[`${sf.id}_modal`];
      clearChildValues(sf, values);
    });
  };

  const handleUpdate = useCallback((id, value, is_parent, field) => {
    setValues((prev) => {
      const updated = {
        ...prev,
        [id]: { value: value, is_parent: is_parent },
      };
      console.log("THis is the field", field);
      if (
        field?.custom_field_details?.sub_fields?.length > 0 ||
        field?.sub_fields?.length > 0
      ) {
        clearChildValues(field, updated);
      }

      return updated;
    });
  }, []);

  // 🔥 RENDER INPUT
  const renderFieldInput = (item, is_parent) => {
    const field = item.custom_field_details;
    const value = values[item.id]?.value;

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextInput
            placeholder={`Enter ${field.name}`}
            placeholderTextColor={primaryColors.gray[400]}
            keyboardType={field.type === "text" ? "default" : "numeric"}
            style={[formElementsStyles.triggerStyle, styles.inputField]}
            value={value?.toString() || ""}
            onChangeText={(val) => handleUpdate(item.id, val, is_parent, item)}
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
              keyboardType="numeric"
              style={[styles.inputField, { flex: 1, borderBottomWidth: 0 }]}
              value={value?.toString() || ""}
              onChangeText={(val) =>
                handleUpdate(item.id, val, is_parent, item)
              }
            />
            <Text style={styles.percentageSign}>%</Text>
          </View>
        );

      case "date":
        return (
          <DatePicker2
            selectedDate={value ? new Date(value) : null}
            setSelectedDate={(date) => {
              console.log("The date is", date.toISOString());
              handleUpdate(
                item.id,
                dateToYYYYMMDD(date.toISOString()),
                is_parent,
                item,
              );
            }}
            showDatePicker={openPickerId === item.id}
            setShowDatePicker={(isOpen) =>
              setOpenPickerId(isOpen ? item.id : null)
            }
            placeholder="Select Date"
          />
        );

      case "checkbox":
        const isChecked = value === "true" || value === true;
        return (
          <TouchableOpacity
            style={styles.checkboxWrapper}
            onPress={() =>
              handleUpdate(
                item.id,
                !isChecked ? "true" : "false",
                is_parent,
                item,
              )
            }
          >
            <Checkbox
              isSelected={isChecked}
              width={SW(20)}
              height={SH(20)}
              stroke={primaryColors.gray[300]}
            />
            <Text style={[body.sm.regular, { marginLeft: SW(8) }]}>
              {isChecked ? "Selected" : "Check to confirm"}
            </Text>
          </TouchableOpacity>
        );

      case "select":
        const options = (field.select_options || []).map((opt) => ({
          id: opt,
          name: opt,
        }));

        return (
          <TouchableOpacity
            style={[formElementsStyles.triggerStyle, styles.selectTrigger]}
            onPress={() =>
              handleUpdate(`${item.id}_modal`, true, is_parent, item)
            }
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !value && { color: primaryColors.gray[400] },
                { flex: 1 },
              ]}
            >
              {value || `Select ${field.name}`}
            </Text>

            <DownArrowOutlineIcon
              width={SH(16)}
              height={SH(16)}
              color={primaryColors.button.active}
            />

            <SelectionPopover
              visible={values[`${item.id}_modal`]?.value}
              onClose={() =>
                handleUpdate(`${item.id}_modal`, false, is_parent, item)
              }
              title={field.name}
              data={options}
              selectedIds={value}
              onConfirm={(selected) =>
                handleUpdate(item.id, selected, is_parent, item)
              }
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  // 🔥 NORMALIZE SUBFIELDS
  const normalizeSubFields = (subFields) =>
    subFields.map((sf) => ({
      id: sf.id,
      custom_field_details: sf,
    }));

  const renderFirstFields = (items, parentValue = null) => {
    return items.map((item) => {
      const field = item.custom_field_details;
      const value = values[item.id]?.value;

      // CONDITION CHECK
      if (
        field.parent_conditional_value !== null &&
        field.parent_conditional_value !== parentValue
      ) {
        return null;
      }

      return (
        <View
          key={item.id}
          style={{
            marginTop: SH(16),
            backgroundColor: primaryColors.gray[50],
            padding: SH(16),
            borderRadius: SW(16),
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: primaryColors.gray[100],
          }}
        >
          <Text style={styles.fieldLabel}>{field.name} *</Text>

          <Spacing space={SH(6)} />

          {renderFieldInput(item, true)}

          {/* 🔁 SUBFIELDS */}
          {renderSubFields(field, value)}
        </View>
      );
    });
  };

  // 🔥 RECURSIVE RENDER
  const renderFieldTree = (items, parentValue = null) => {
    return items.map((item) => {
      const field = item.custom_field_details;
      const value = values[item.id]?.value;

      // CONDITION CHECK
      if (
        field.parent_conditional_value !== null &&
        field.parent_conditional_value !== parentValue
      ) {
        return null;
      }

      return (
        <View
          key={item.id}
          style={{
            marginTop: SH(16),
          }}
        >
          <Text style={styles.fieldLabel}>{field.name} *</Text>

          <Spacing space={SH(6)} />

          {renderFieldInput(item, false)}

          {/* 🔁 SUBFIELDS */}
          {renderSubFields(field, value)}
        </View>
      );
    });
  };

  // 🔥 CONDITIONAL LOGIC
  const renderSubFields = (field, parentValue) => {
    const subFields = field.sub_fields || [];
    if (!subFields.length) return null;

    const normalized = normalizeSubFields(subFields);

    // SELECT → match value
    if (field.type === "select") {
      return renderFieldTree(normalized, parentValue);
    }

    // NON SELECT → show if value exists
    if (parentValue !== undefined && parentValue !== "") {
      return renderFieldTree(normalized, parentValue);
    }

    return null;
  };

  // 🔥 VALIDATION
  const validateTree = (items, parentValue = null) => {
    for (const item of items) {
      const field = item.custom_field_details;
      const value = values[item.id]?.value;

      if (
        field.parent_conditional_value !== null &&
        field.parent_conditional_value !== parentValue
      ) {
        continue;
      }

      if (!value) return field.name;

      const subFields = field.sub_fields || [];

      if (subFields.length) {
        const error = validateTree(normalizeSubFields(subFields), value);
        if (error) return error;
      }
    }
    return null;
  };

  const validateAndSubmit = () => {
    const errorField = validateTree(fields);

    if (errorField) {
      Toast.show({
        type: "error",
        text1: "Required Field",
        text2: `Please fill in the ${errorField} field.`,
      });
      return;
    }
    console.log("These are the values", values);
    onConfirm(values);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop} onPress={Keyboard.dismiss}>
        <View style={styles.popoverContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Update Required Fields</Text>
            <TouchableOpacity
              onPress={async () => {
                console.log("Run onclose from close icon");
                await onClose();
              }}
            >
              <CloseOutlineIcon
                fill={primaryColors.gray[400]}
                width={SW(18)}
                height={SH(18)}
              />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={{
              paddingHorizontal: SW(20),
              paddingBottom: SH(16),
            }}
            keyboardShouldPersistTaps="handled"
          >
            {renderFirstFields(fields)}
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <BottomButton
              title="Cancel"
              onPress={async () => {
                console.log("Run onclose from cancel button");
                await onClose();
              }}
              type="outlined"
              style={{ flex: 1 }}
            />
            <BottomButton
              title="Submit"
              onPress={validateAndSubmit}
              type="default"
              style={{ flex: 1 }}
              loading={loading}
              disabled={loading}
              icon={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : null
              }
            />
          </View>
        </View>
      </View>
      {/* <Toast /> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
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
  instructionText: { ...body.sm.regular, color: primaryColors.gray[500] },
  listContainer: { flexShrink: 1 },
  fieldLabel: { ...body.sm.medium, color: primaryColors.gray[700] },
  inputField: {
    ...body.sm.regular,
    color: primaryColors.gray[900],
    height: SH(44),
    backgroundColor: primaryColors.gray[25],
  },
  percentageContainer: {
    alignItems: "center",
    backgroundColor: primaryColors.gray[25],
  },
  percentageSign: {
    ...body.sm.medium,
    color: primaryColors.gray[500],
    paddingHorizontal: SW(8),
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    height: SH(44),
    backgroundColor: primaryColors.gray[25],
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SH(8),
  },
  footer: {
    flexDirection: "row",
    gap: SW(12),
    padding: SW(20),
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[100],
  },
});

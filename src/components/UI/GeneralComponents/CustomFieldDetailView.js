import { View, Text, StyleSheet } from "react-native";
import { formatDateWithoutTime, SH, SW } from "../../../utils";
import { body, body as typography } from "../DesignSystem/typography";
import { primaryColors } from "../DesignSystem/colorPalette";

export const CustomFieldDetailView = ({ customFieldItemDetails = [] }) => {
  if (!customFieldItemDetails?.length) return null;

  if (
    customFieldItemDetails?.[0]?.value === "" ||
    customFieldItemDetails?.[0]?.value === null
  ) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...body.xs.regular,
            color: primaryColors.gray[500],
            textAlign: "center",
          }}
        >
          Custom Fields will be visible after task is completed or discarded
        </Text>
      </View>
    );
  }

  const getFieldValue = (fieldId) => {
    return customFieldItemDetails.find(
      (item) => item.fk_custom_field === fieldId,
    );
  };

  const renderSubFields = (field, parentValue) => {
    const subFields = field.sub_fields || [];

    if (!subFields.length) return null;

    return subFields.map((subField) => {
      if (
        subField.parent_conditional_value !== null &&
        subField.parent_conditional_value !== parentValue
      ) {
        return null;
      }

      const childItem = getFieldValue(subField.id);

      if (!childItem) return null;

      return (
        <View key={childItem.id} style={styles.childFieldContainer}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>
              {childItem.custom_field_details?.name}:
            </Text>

            <Text style={styles.fieldValue}>{childItem.value || "-"}</Text>
          </View>

          {renderSubFields(childItem.custom_field_details, childItem.value)}
        </View>
      );
    });
  };

  const parentFields = customFieldItemDetails.filter(
    (item) => !item.custom_field_details?.fk_parent_custom_field,
  );

  return (
    <View style={styles.content}>
      {parentFields.map((item, index) => (
        <View
          key={item.id}
          style={[styles.groupContainer, index === 0 && { marginTop: 0 }]}
        >
          <View style={styles.fieldRow}>
            <Text
              style={styles.fieldLabel}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {console.log("This is the item", item)}
              {item.custom_field_details?.name}:
            </Text>

            <Text style={styles.fieldValue}>
              {item?.custom_field_details?.type === "date"
                ? formatDateWithoutTime(item?.value)
                : item?.value || "-"}
            </Text>
          </View>
          {console.log("This is the item", item)}
          {renderSubFields(item.custom_field_details, item.value)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },

  groupContainer: {
    backgroundColor: "white",
    padding: SH(16),
    borderRadius: SW(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: primaryColors.gray[100],
    marginTop: SH(12),
    elevation: 1,
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  childFieldContainer: {
    marginTop: SH(8),
  },

  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SW(10),
  },

  fieldLabel: {
    ...typography.sm.medium,
    color: primaryColors.gray[700],
    flexGrow: 1,
    flexShrink: 1,
  },

  fieldValue: {
    ...typography.sm.medium,
    color: primaryColors.gray[700],
    flex: 2,
    textAlign: "right",
  },
});

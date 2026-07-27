import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Colors,
  SW,
  SH,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  dateToYYYYMMDD,
  capitalizeEachWord,
} from "@/utils";
import { Checkbox, CloseOutlineIcon, DownArrowOutlineIcon } from "@/svg";
import { body } from "@/design/typography";
import { primaryColors } from "@/design/colors";
import Spacing from "@/components/Spacing";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
import Toast from "react-native-toast-message";
import { DatePicker2 } from "@/components/UI/GeneralComponents/DatePicker2";
import SelectionPopover from "@/components/UI/GeneralComponents/PopUps/SelectionPopover";
import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import { spacing } from "@/design/spacing";
import { fullWidth, ystack } from "@/design/layout";
import { groupAdditionalFieldsBySection } from "@/screens/Leads/utils/leadsFunctions";
import { useTheme } from "@/hooks/useTheme";
import { borderRadius, borderWidth } from "@/design/borders";
import { ItemSeparator } from "@/components/ItemSeperator";

const AdditionalFieldsForm = ({
  allFields,
  setValues,
  values,
}: {
  allFields: any[];
  setValues: Dispatch<SetStateAction<any>>;
  values: any;
}) => {
  const { theme } = useTheme();
  const [openPickerId, setOpenPickerId] = useState(null);
  const formElementsStyles = useFormElementsStyles();
  // const { updateLead, leadsLoading } = useLeadsEndpoints();
  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const snapPoints = isKeyboardVisible ? "100%" : "80%";

  const resetAdditionalFieldsForm = () => {
    console.log("In reset new Folder bottom sheet");
    setOpenPickerId(null);
  };

  const groupedAdditionalFields = groupAdditionalFieldsBySection(allFields);

  const handleUpdate = useCallback((id: string, value: any) => {
    setValues((prev: any) => ({
      ...prev,
      [id]: { value },
    }));
  }, []);

  const renderFieldInput = (item: any) => {
    const field = item;
    const value = values[item?.id]?.value;

    switch (field?.type) {
      case "text":
      case "number":
        return (
          <TextInput
            placeholder={`Enter ${field?.name}`}
            placeholderTextColor={primaryColors.gray[400]}
            keyboardType={field?.type === "text" ? "default" : "numeric"}
            style={[formElementsStyles.triggerStyle, styles.inputField]}
            defaultValue={value?.toString() || ""}
            onChangeText={(val) => handleUpdate(item.id, val)}
          />
        );

      case "percentage":
        return (
          <View
            style={[
              formElementsStyles.triggerStyle,
              styles.percentageContainer,
              { flexDirection: "row", overflow: "hidden" },
            ]}
          >
            <TextInput
              placeholder={`Enter ${field?.name}`}
              placeholderTextColor={primaryColors.gray[400]}
              keyboardType="numeric"
              style={[styles.inputField, { flex: 1, borderBottomWidth: 0 }]}
              defaultValue={value?.toString() || ""}
              onChangeText={(val) => handleUpdate(item.id, val)}
            />
            <Text style={styles.percentageSign}>%</Text>
          </View>
        );

      case "date":
        return (
          <DatePicker2
            selectedDate={value ? new Date(value) : null}
            setSelectedDate={(date: Date) => {
              console.log("The date is", date.toISOString());
              handleUpdate(item.id, dateToYYYYMMDD(date.toISOString()));
            }}
            showDatePicker={openPickerId === item.id}
            setShowDatePicker={(isOpen: boolean) =>
              setOpenPickerId(isOpen ? item.id : null)
            }
            placeholder="Select Date"
            minDate={null}
            maxDate={null}
          />
        );

      case "checkbox":
        const isChecked = value === "true" || value === true;
        return (
          <TouchableOpacity
            style={styles.checkboxWrapper}
            onPress={() => handleUpdate(item.id, !isChecked ? "true" : "false")}
          >
            <Checkbox
              isSelected={isChecked}
              width={SW(20)}
              height={SH(20)}
              stroke={primaryColors.gray[300]}
              style={{}}
            />
            <Text style={[body.sm.regular, { marginLeft: SW(8) }]}>
              {isChecked ? "Selected" : "Check to confirm"}
            </Text>
          </TouchableOpacity>
        );

      case "select":
        const options = (field?.select_options || []).map((opt: any) => ({
          id: opt,
          name: opt,
        }));

        return (
          <TouchableOpacity
            style={[formElementsStyles.triggerStyle, styles.selectTrigger]}
            onPress={() => handleUpdate(`${item.id}_modal`, true)}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                !value && { color: primaryColors.gray[400] },
                { flex: 1 },
              ]}
            >
              {value || `Select ${field?.name}`}
            </Text>

            <DownArrowOutlineIcon
              width={SH(16)}
              height={SH(16)}
              color={primaryColors.gray[900]}
            />

            <SelectionPopover
              visible={values[`${item.id}_modal`]?.value}
              onClose={() => handleUpdate(`${item.id}_modal`, false)}
              title={field?.name}
              data={options}
              selectedIds={value}
              onConfirm={(selected: any) => handleUpdate(item.id, selected)}
              loading={false}
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const renderFirstFields = (items: any) => {
    return items.map((item: any) => {
      const field = item;
      console.log("This is the item", item);
      return (
        <View
          key={item.id}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flex: 1,
            gap: SH(6),
            marginBottom: spacing.lg,
          }}
        >
          <Text style={styles.fieldLabel}>
            {capitalizeEachWord(field?.name)}
          </Text>
          <View style={[fullWidth]}>{renderFieldInput(item)}</View>
        </View>
      );
    });
  };

  return (
    <>
      <View
        style={{
          width: "100%",
          paddingBottom: spacing.lg,
        }}
      >
        {Object.entries(groupedAdditionalFields).map(
          ([section, fields], index) => {
            return (
              <View
                key={index}
                style={[
                  ystack,
                  {
                    padding: spacing.lg,
                    backgroundColor: theme.background,
                    borderRadius: borderRadius.lg,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <Text style={[body.md.medium, { color: theme.text }]}>
                  {section}
                </Text>
                <ItemSeparator
                  style={{
                    marginVertical: spacing.sm,
                    borderTopWidth: borderWidth.hw,
                  }}
                  direction="horizontal"
                  opacity={1}
                />
                {renderFirstFields(fields)}
              </View>
            );
          },
        )}
      </View>
    </>
  );
};
export default AdditionalFieldsForm;

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

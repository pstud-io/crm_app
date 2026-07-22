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
import { useCallback, useState } from "react";
import {
  Colors,
  SW,
  SH,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  dateToYYYYMMDD,
} from "@/utils";
import { Checkbox, CloseOutlineIcon, DownArrowOutlineIcon } from "@/svg";
import { body } from "@/design/typography";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import { formElementsStyles } from "../../../components/UI/Dropdown/formElementStyles";
import { Spacing } from "../../../components";
import { BottomButton } from "../../../components/UI/GeneralComponents/BottomButton";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";
import { useKeyboard } from "@react-native-community/hooks";
import Toast from "react-native-toast-message";
import { useLeadsEndpoints } from "../hooks/useLeadsEndpoints";
import { DatePicker2 } from "@/components/UI/GeneralComponents/DatePicker2";
import SelectionPopover from "@/components/UI/GeneralComponents/PopUps/SelectionPopover";

const EditProjectBottomSheet = ({
  onRefresh,
  editProjectBottomSheetRef,
  editProjectFunctions,
  editProjectDataRef,
}) => {
  const [section, setSection] = useState("");
  const [fields, setfields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [values, setValues] = useState({});
  const [openPickerId, setOpenPickerId] = useState(null);

  const { updateLead, leadsLoading } = useLeadsEndpoints();
  const isKeyboardVisible = useKeyboardStatus();
  const keyboard = useKeyboard();
  const snapPoints = isKeyboardVisible ? "100%" : "80%";

  const resetEditProjectBottomSheet = () => {
    console.log("In reset new Folder bottom sheet");
    setValues({});
    setSection("");
    setfields([]);
    setAllFields([]);
    setOpenPickerId(null);
  };

  const handleUpdate = useCallback((id, value) => {
    setValues((prev) => ({
      ...prev,
      [id]: { value },
    }));
  }, []);

  const renderFieldInput = (item) => {
    const field = item?.additional_field;
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
              { flexDirection: "row" },
            ]}
          >
            <TextInput
              placeholder={`Enter ${field?.name}`}
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
            setSelectedDate={(date) => {
              console.log("The date is", date.toISOString());
              handleUpdate(item.id, dateToYYYYMMDD(date.toISOString()));
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
            onPress={() => handleUpdate(item.id, !isChecked ? "true" : "false")}
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
        const options = (field?.select_options || []).map((opt) => ({
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
              color={primaryColors.button.active}
            />

            <SelectionPopover
              visible={values[`${item.id}_modal`]?.value}
              onClose={() => handleUpdate(`${item.id}_modal`, false)}
              title={field?.name}
              data={options}
              selectedIds={value}
              onConfirm={(selected) => handleUpdate(item.id, selected)}
            />
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const renderFirstFields = (items) => {
    return items.map((item) => {
      const field = item.additional_field;
      console.log("This is the item", item);
      return (
        <View
          key={item.id}
          style={{
            marginTop: SH(16),
            borderRadius: SW(16),
          }}
        >
          <Text style={styles.fieldLabel}>{field?.name}</Text>

          <Spacing space={SH(6)} />

          {renderFieldInput(item)}
        </View>
      );
    });
  };

  const populateValues = useCallback((fields) => {
    const initialValues = {};

    fields.forEach((item) => {
      initialValues[item.id] = {
        value: item.value ?? "",
      };
    });

    setValues(initialValues);
  }, []);

  const createPayload = (fields, values) => {
    return fields.map((field) => ({
      id: field.id,
      fk_project_additional_field: field.fk_project_additional_field,
      fk_project: field.fk_project,
      value: values[field.id]?.value ?? "",
      is_active: field.is_active,
    }));
  };

  return (
    <BottomSheetModal
      ref={editProjectBottomSheetRef}
      snapPoints={[snapPoints]}
      enablePanDownToClose={true}
      enableBlurKeyboardOnGesture={false}
      enableContentPanningGesture={false}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      enableDynamicSizing={false}
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // backdrop visible when sheet index >= 0
            disappearsOnIndex={-1} // hidden when index = -1
            opacity={0.5} // dim amount
          />
        );
      }}
      onDismiss={() => resetEditProjectBottomSheet()}
      onAnimate={async (fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          console.log("This is editprojectdataref", editProjectDataRef);
          setSection(editProjectDataRef.current.section);
          setfields(editProjectDataRef.current.fields);
          setAllFields(editProjectDataRef.current.allFields);
          populateValues(editProjectDataRef.current.fields);
        }
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
          paddingTop: 12,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: primaryColors.gray[900],
            ...body.md.semiBold,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Editing {section}
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log("Pressed close edit folder");
            editProjectFunctions.close();
          }}
        >
          <CloseOutlineIcon
            fill={Colors.black_text_color}
            width={SW(16)}
            height={SH(16)}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginVertical: SH(16),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: Colors.gray_line_color,
        }}
      />
      <BottomSheetScrollView
        style={{
          flex: 1,
          paddingHorizontal: SW(20),
          topBorderColor: Colors.gray_line_color,
          topBorderWidth: StyleSheet.hairlineWidth,
        }}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingBottom: isKeyboardVisible && keyboard.keyboardHeight - SH(60),
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ width: "100%" }}>
            {renderFirstFields(fields)}
            <Spacing space={SH(16)} />
          </View>
        </TouchableWithoutFeedback>
      </BottomSheetScrollView>
      <View style={formElementsStyles.bottomButtonContainer}>
        <BottomButton
          title={"Cancel"}
          onPress={() => editProjectFunctions.close()}
          type={"outlined"}
        />
        <BottomButton
          icon={
            leadsLoading.updateLead && (
              <ActivityIndicator size={12} color={Colors.white} />
            )
          }
          disabled={leadsLoading.updateLead}
          title={"Submit"}
          onPress={async () => {
            console.log("These are the values", values);
            const payload = createPayload(allFields, values);
            await updateLead(payload, onRefresh);
            editProjectFunctions.close();
          }}
          type={"default"}
        />
      </View>
    </BottomSheetModal>
  );
};
export default EditProjectBottomSheet;

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

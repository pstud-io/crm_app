import { TouchableOpacity, Text, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { CalendarOutline } from "../../../svg"; // Ensure path is correct
import { SW, SH } from "../../../utils";
import { useState } from "react";
import { primaryColors } from "../DesignSystem/colorPalette";
import DateTimePickerPopover from "../../specific/DateTimePickerPopover";

export const DatePicker2 = ({
  showDatePicker,
  setShowDatePicker,
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
  placeholder = "Select Date",
}) => {
  const [dateValue, setDateValue] = useState(
    selectedDate instanceof Date ? selectedDate : new Date(),
  );

  const onChange = (date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setDateValue(date);
      setSelectedDate(date);
    }
  };

  return (
    <>
      {Platform.OS === "android" && (
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            formElementsStyles.triggerStyle,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: primaryColors.gray[25],
            },
          ]}
        >
          <Text style={formElementsStyles.valueStyle}>
            {dateValue ? new Date(dateValue).toLocaleDateString() : placeholder}
          </Text>

          {/* ADD THE ICON HERE */}
          <CalendarOutline width={SW(18)} height={SH(18)} strokeWidth={2} />
        </TouchableOpacity>
      )}

      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={"default"}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={onChange}
        />
      )}
      {Platform.OS === "ios" && (
        <DateTimePickerPopover
          selectedDate={dateValue}
          setSelectedDate={(date) => onChange(date)}
          type={"date"}
        />
        // <DateTimePicker
        //   value={dateValue}
        //   mode="date"
        //   style={{
        //     alignSelf: "flex-start",
        //     transform: [{ translateX: -SW(8) }],
        //   }}
        //   display={"default"}
        //   minimumDate={minDate}
        //   maximumDate={maxDate}
        //   onChange={onChange}
        // />
      )}
    </>
  );
};

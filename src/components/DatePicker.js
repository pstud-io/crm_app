import { TouchableOpacity, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formElementsStyles } from "./UI/Dropdown/formElementStyles";
import DateTimePickerPopover from "./DateTimePickerPopover";

export const DatePicker = ({
  showDatePicker,
  setShowDatePicker,
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
  isCustomRange = false,
}) => {
  return Platform.OS === "android" ? (
    <>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={formElementsStyles.triggerStyle}
      >
        <Text style={formElementsStyles.valueStyle}>
          {selectedDate?.toLocaleDateString() || "Select Due Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          style={formElementsStyles.triggerStyle}
          mode="date"
          display={"default"}
          minimumDate={minDate}
          maximumDate={maxDate}
          onValueChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}
    </>
  ) : (
    <>
      <DateTimePickerPopover
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        minDate={minDate}
        maxDate={maxDate}
        type={"date"}
        isCustomRange={isCustomRange}
      />
    </>
  );
};

import {
  TouchableOpacity,
  Text,
  Platform,
  View,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { SH, SW } from "../../../utils";
import { primaryColors } from "../DesignSystem/colorPalette";
import DateTimePickerPopover from "../../specific/DateTimePickerPopover";

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
          onChange={(event, date) => {
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
      {/* {isCustomRange ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          style={{
            alignSelf: "flex-start",
            // transform: [{ translateX: -SW(8) }],
          }}
          display={"custom"}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={(event, date) => {
            if (date) {
              setShowDatePicker(false);
              setSelectedDate(date);
            }
          }}
        />
      ) : ( */}
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
      {/* )} */}
    </>
  );
};

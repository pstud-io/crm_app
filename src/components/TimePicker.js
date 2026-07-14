import { TouchableOpacity, Text, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import DateTimePickerPopover from "../../specific/DateTimePickerPopover";

export const TimePicker = ({
  showTimePicker,
  setShowTimePicker,
  selectedTime,
  setSelectedTime,
  onChange,
  disabled,
  isRegularization,
}) => {
  return Platform.OS === "android" ? (
    <>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={formElementsStyles.triggerStyle}
      >
        <Text style={formElementsStyles.valueStyle}>
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) || "Select Time"}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          style={formElementsStyles.triggerStyle}
          mode="time"
          display={"default"}
          onValueChange={(event, time) => {
            setShowTimePicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}
    </>
  ) : (
    <DateTimePickerPopover
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      type={"time"}
      onChange={onChange}
      disabled={disabled}
      isRegularization={isRegularization}
    />
  );
};

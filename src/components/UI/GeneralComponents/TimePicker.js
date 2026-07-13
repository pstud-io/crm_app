import { TouchableOpacity, Text, Platform, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { SW } from "../../../utils";
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
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}
    </>
  ) : (
    // <DateTimePicker
    //   value={selectedTime}
    //   mode="time"
    //   style={{
    //     alignSelf: "flex-start",
    //     transform: [{ translateX: -SW(8) }],
    //   }}
    //   display={"compact"}
    //   onChange={(event, time) => {
    //     if (time) {
    //       setSelectedTime(time);
    //     }
    //   }}
    // />
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

import { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import Popover from "react-native-popover-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import { primaryColors } from "@/design/colors";
import { formElementsStyles } from "./UI/Dropdown/formElementStyles";
import { body } from "@/design/typography";
import { Placement } from "react-native-popover-view/dist/Types";

const DateTimePickerPopover = ({
  selectedDate,
  selectedTime,
  minDate,
  maxDate,
  setSelectedDate,
  setSelectedTime,
  type,
  isCustomRange,
  onChange,
  disabled,
  isRegularization,
}) => {
  const DateTimePickerPopoverRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  return (
    <Popover
      backgroundStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
      ref={DateTimePickerPopoverRef}
      popoverStyle={{
        backgroundColor: "transparent",
        overflow: "visible",
      }}
      animationConfig={{
        duration: 150,
      }}
      placement={Placement.FLOATING}
      arrowSize={{ width: 0, height: 0 }}
      offset={8}
      onOpenStart={() => {
        setDate(selectedDate);
        setTime(selectedTime);
      }}
      from={
        type === "date" ? (
          <TouchableOpacity style={formElementsStyles.triggerStyle}>
            <Text style={formElementsStyles.valueStyle}>
              {selectedDate?.toLocaleDateString() || "Select Due Date"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={formElementsStyles.triggerStyle}
            disabled={disabled}
          >
            <Text
              style={[
                formElementsStyles.valueStyle,
                disabled && { color: primaryColors.gray[400] },
              ]}
            >
              {disabled
                ? "Please set punch in time"
                : `${
                    selectedTime?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "Select Time"
                  }`}
            </Text>
          </TouchableOpacity>
        )
      }
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          padding: 8,
          backgroundColor: "white",
          ...formElementsStyles.minimalShadowDown,
        }}
      >
        {type === "date" && (
          <DateTimePicker
            value={date}
            mode="date"
            display={"inline"}
            minimumDate={minDate}
            maximumDate={maxDate}
            onValueChange={(event, date) => {
              if (date) {
                setDate(date);
              }
            }}
          />
        )}
        {type === "time" && (
          <DateTimePicker
            value={time}
            mode="time"
            style={{
              alignSelf: "flex-start",
              transform: [{ translateX: -8 }],
            }}
            display={"spinner"}
            onValueChange={
              onChange
                ? onChange
                : (event, time) => {
                    if (time) {
                      setTime(time);
                    }
                  }
            }
          />
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
            paddingTop: 12,
            paddingBottom: 4,
            paddingHorizontal: 16,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: "#ddd",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              DateTimePickerPopoverRef.current.requestClose();
            }}
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: primaryColors.gray[900],
              paddingVertical: 8,
              paddingHorizontal: 24,
              backgroundColor: "#fff",
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.sm.regular,
                color: primaryColors.gray[900],
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (isRegularization) {
                DateTimePickerPopoverRef.current.requestClose();
                return;
              }
              if (type === "time") {
                setSelectedTime(time);
              }
              if (type === "date") {
                setSelectedDate(date);
              }
              DateTimePickerPopoverRef.current.requestClose();
            }}
            style={{
              backgroundColor: primaryColors.gray[900],
              paddingVertical: 8,
              paddingHorizontal: 24,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.sm.regular,
                color: primaryColors.gray[25],
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popover>
  );
};

export default DateTimePickerPopover;

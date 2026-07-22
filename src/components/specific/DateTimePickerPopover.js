import { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import { SCREEN_WIDTH, SH, SW } from "../../utils";
import Popover from "react-native-popover-view";
import { primaryColors } from "../UI/DesignSystem/colorPalette";
import { body } from "../UI/DesignSystem/typography";
import { ProjectInfoCardItem } from "../common/ProjectInfoCardItem";
import PhoneIcon from "../../svg/phone";
import WhatsappIcon from "../../svg/whatsapp";
import { formElementsStyles } from "../UI/Dropdown/formElementStyles";
import DateTimePicker from "@react-native-community/datetimepicker";

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
      placement={isCustomRange ? "floating" : "floating"}
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
          borderRadius: SW(20),
          padding: SH(8),
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
              transform: [{ translateX: -SW(8) }],
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
            gap: SW(8),
            paddingTop: SW(12),
            paddingBottom: SW(4),
            paddingHorizontal: SH(16),
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
              borderColor: primaryColors.button.active,
              paddingVertical: SH(8),
              paddingHorizontal: SH(24),
              backgroundColor: "#fff",
              borderRadius: SW(24),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.sm.regular,
                color: primaryColors.button.active,
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
              backgroundColor: primaryColors.button.active,
              paddingVertical: SH(8),
              paddingHorizontal: SH(24),
              borderRadius: SW(24),
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

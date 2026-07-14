import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import Popover from "react-native-popover-view";
import { useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import { SCREEN_WIDTH } from "@/design/layout";
import { useFormElementsStyles } from "@/hooks/useFormElementsStyles";
import { primaryColors } from "@/design/colors";
import { body } from "@/design/typography";
import { DatePicker } from "@/components/DatePicker";

export const OverdueCustomRangeFilterPopover = ({
  overdueFromDate,
  setOverdueFromDate,
  overdueToDate,
  setOverdueToDate,
  overdueOption,
  setOverdueOption,
  modalRef,
  visible,
  setVisible,
}) => {
  const overdueCustomRangeFilterPopoverRef = useRef(null);
  const [fromDate, setFromDate] = useState(
    overdueFromDate ? new Date(overdueFromDate) : new Date(),
  );
  const [toDate, setToDate] = useState(
    overdueToDate ? new Date(overdueToDate) : new Date(),
  );
  const formElementsStyles = useFormElementsStyles();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      ref={modalRef}
      onShow={() => {
        if (overdueOption === "all") {
          setFromDate(overdueFromDate ? new Date(overdueFromDate) : new Date());
          setToDate(overdueToDate ? new Date(overdueToDate) : new Date());
        }
        if (overdueOption === "custom") {
          setFromDate(overdueFromDate ? new Date(overdueFromDate) : new Date());
          setToDate(overdueToDate ? new Date(overdueToDate) : new Date());
        }
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.2)", // optional backdrop
        }}
        onPress={() => setVisible(false)}
        activeOpacity={1}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            // width: SCREEN_WIDTH * 0.75,
            height: 220,
            gap: 4,
            justifyContent: "space-between",
            width: 300,
            alignItems: "flex-start",
            paddingTop: 16,
            backgroundColor: "white",
            borderRadius: 16,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: primaryColors.gray[200],
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: "#ddd",
              width: "100%",
            }}
          >
            <Text
              style={{
                ...body.md.medium,
                color: primaryColors.gray[900],
              }}
              numberOfLines={0}
            >
              Set Date Range
            </Text>
          </View>
          <View style={styles.dateRangeRow}>
            <View style={styles.dateRangeColumn}>
              <Text style={styles.dateRangeLabel}>From</Text>
              <DatePicker
                selectedDate={fromDate}
                setSelectedDate={setFromDate}
                placeholder="Start Date"
                showDatePicker={showStartDatePicker}
                setShowDatePicker={setShowStartDatePicker}
                maxDate={today}
                isCustomRange={true}
              />
            </View>

            <View style={styles.dateRangeColumn}>
              <Text style={styles.dateRangeLabel}>To</Text>
              <DatePicker
                selectedDate={toDate}
                setSelectedDate={setToDate}
                placeholder="End Date"
                maxDate={today}
                showDatePicker={showEndDatePicker}
                setShowDatePicker={setShowEndDatePicker}
                isCustomRange={true}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: "#ddd",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // overdueCustomRangeFilterPopoverRef.current.requestClose();
                setVisible(false);
                setOverdueFromDate(null);
                setOverdueToDate(null);
                setOverdueOption("all");
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
                Remove
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // overdueCustomRangeFilterPopoverRef.current.requestClose();
                setVisible(false);
                setOverdueOption("custom");
                setOverdueFromDate(new Date(fromDate));
                setOverdueToDate(new Date(toDate));
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
      </TouchableOpacity>
    </Modal>
    // </Popover>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: primaryColors.gray[900],
    ...body.md.semiBold,
  },
  balanceText: {
    color: primaryColors.gray[500],
    ...body.xs.regular,
  },
  separator: {
    marginVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: primaryColors.gray[200],
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  daysCountText: {
    ...body.sm.medium,
    color: primaryColors.brand[1000],
    backgroundColor: primaryColors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateRangeRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: 12,
    paddingHorizontal: 16,
  },
  dateRangeColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    flexGrow: 1,
  },
  dateRangeLabel: {
    ...body.xs.medium,
    color: primaryColors.gray[600],
  },
});

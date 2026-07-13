import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { DatePicker } from "../DatePicker";
import { BottomButton } from "../BottomButton";
import { DownloadOutlineIcon, CloseOutlineIcon } from "../../../../svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const DownloadDatePopup = ({ visible, onClose, onConfirm, loading }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);

  const handleDownload = () => {
    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = endDate.toISOString().split('T')[0];
    onConfirm({ startDate: formattedStart, endDate: formattedEnd });
  };

  return (
    <Popover
      isVisible={visible}
      onRequestClose={onClose}
      // Section: Animation Config for Smoothness
      animationConfig={{ duration: 300, useNativeDriver: true }}
      backgroundStyle={styles.backdrop}
      popoverStyle={styles.popoverContainer}
      displayArea={{ x: 0, y: 0, width: SCREEN_WIDTH, height: Dimensions.get("window").height }}
    >
      <View style={styles.innerContent}>
        {/* Header with Close Button */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Download Activities</Text>
          <TouchableOpacity onPress={onClose}>
            <CloseOutlineIcon fill={primaryColors.gray[400]} width={SW(18)} height={SH(18)} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.bodyPadding}>
          <Text style={styles.subtitle}>Select a date range for the report</Text>
          <Spacing space={SH(20)} />

          <View style={styles.dateRangeRow}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>From</Text>
              <DatePicker
                selectedDate={startDate}
                setSelectedDate={(date) => {
                  setStartDate(date);
                  if (date > endDate) setEndDate(date);
                }}
                showDatePicker={showStartDatePicker}
                setShowDatePicker={setShowStartDatePicker}
                maxDate={new Date()}
              />
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>To</Text>
              <DatePicker
                selectedDate={endDate}
                setSelectedDate={setEndDate}
                showDatePicker={showEndDatePicker}
                setShowDatePicker={setShowEndDatePicker}
                minDate={startDate}
                maxDate={new Date()}
              />
            </View>
          </View>

          <Spacing space={SH(24)} />

          <View style={styles.bottomButtonContainer}>
            <BottomButton title="Cancel" onPress={onClose} type="outlined" style={styles.flexButton} />
            <BottomButton
              title="Download"
              onPress={handleDownload}
              type="default"
              disabled={loading}
              loading={loading}
              style={styles.flexButton}
            />
          </View>
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: {
    width: "100%",
  },
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
  bodyPadding: {
    padding: SW(20),
  },
  headerTitle: {
    ...body.md.bold,
    color: primaryColors.gray[900],
  },
  subtitle: {
    ...body.sm.regular,
    color: primaryColors.gray[500],
  },
  dateRangeRow: {
    flexDirection: "row",
    gap: SW(12),
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    ...body.xs.medium,
    color: primaryColors.gray[600],
    marginBottom: SH(6),
  },
  bottomButtonContainer: {
    flexDirection: "row",
    gap: SW(12),
  },
  flexButton: {
    flex: 1,
  },
});

export default DownloadDatePopup;
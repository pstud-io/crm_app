import { primaryColors } from "@/design/colors";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthYearPicker = ({
  value,
  onChange,
  visible,
  onClose,
  minimumDate,
  maximumDate,
}) => {
  const initialDate = value instanceof Date ? value : new Date();

  const [tempMonth, setTempMonth] = useState(initialDate.getMonth());
  const [tempYear, setTempYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    if (visible) {
      const date = value instanceof Date ? value : new Date();

      setTempMonth(date.getMonth());
      setTempYear(date.getFullYear());
    }
  }, [visible, value]);

  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {
    const minYear =
      minimumDate instanceof Date
        ? minimumDate.getFullYear()
        : currentYear - 10;

    const maxYear =
      maximumDate instanceof Date
        ? maximumDate.getFullYear()
        : currentYear + 10;

    const result = [];

    for (let year = minYear; year <= maxYear; year++) {
      result.push(year);
    }

    return result;
  }, [minimumDate, maximumDate, currentYear]);

  const isMonthDisabled = (month) => {
    if (minimumDate instanceof Date) {
      const minimumYear = minimumDate.getFullYear();
      const minimumMonth = minimumDate.getMonth();

      if (
        tempYear < minimumYear ||
        (tempYear === minimumYear && month < minimumMonth)
      ) {
        return true;
      }
    }

    if (maximumDate instanceof Date) {
      const maximumYear = maximumDate.getFullYear();
      const maximumMonth = maximumDate.getMonth();

      if (
        tempYear > maximumYear ||
        (tempYear === maximumYear && month > maximumMonth)
      ) {
        return true;
      }
    }

    return false;
  };

  const handleConfirm = () => {
    const selected = new Date(
      tempYear,
      tempMonth,
      1,
      value instanceof Date ? value.getHours() : 0,
      value instanceof Date ? value.getMinutes() : 0,
      value instanceof Date ? value.getSeconds() : 0,
      value instanceof Date ? value.getMilliseconds() : 0,
    );

    onChange?.(selected);
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Select Month</Text>

            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Year selector */}
          <View style={styles.yearSelector}>
            <TouchableOpacity
              onPress={() => {
                const index = years.indexOf(tempYear);

                if (index > 0) {
                  setTempYear(years[index - 1]);
                }
              }}
              disabled={years.indexOf(tempYear) <= 0}
              style={styles.arrowButton}
            >
              <Text
                style={[
                  styles.arrow,
                  years.indexOf(tempYear) <= 0 && styles.disabledText,
                ]}
              >
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={styles.yearText}>{tempYear}</Text>

            <TouchableOpacity
              onPress={() => {
                const index = years.indexOf(tempYear);

                if (index < years.length - 1) {
                  setTempYear(years[index + 1]);
                }
              }}
              disabled={years.indexOf(tempYear) >= years.length - 1}
              style={styles.arrowButton}
            >
              <Text
                style={[
                  styles.arrow,
                  years.indexOf(tempYear) >= years.length - 1 &&
                    styles.disabledText,
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {/* Months */}
          <View style={styles.monthGrid}>
            {MONTHS.map((month, index) => {
              const selected = tempMonth === index;
              const disabled = isMonthDisabled(index);

              return (
                <TouchableOpacity
                  key={month}
                  disabled={disabled}
                  onPress={() => setTempMonth(index)}
                  style={[
                    styles.monthButton,
                    selected && styles.selectedMonthButton,
                    disabled && styles.disabledMonthButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.monthText,
                      selected && styles.selectedMonthText,
                      disabled && styles.disabledText,
                    ]}
                  >
                    {month.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  container: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  cancelText: {
    fontSize: 15,
    color: "#6B7280",
  },

  doneText: {
    fontSize: 15,
    fontWeight: "600",
    color: primaryColors.brand[900],
  },

  yearSelector: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },

  arrowButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 32,
    lineHeight: 34,
    color: "#111827",
  },

  yearText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    minWidth: 70,
    textAlign: "center",
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  monthButton: {
    width: "25%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  selectedMonthButton: {
    backgroundColor: primaryColors.gray[900],
  },

  disabledMonthButton: {
    opacity: 0.35,
  },

  monthText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },

  selectedMonthText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  disabledText: {
    color: "#9CA3AF",
  },
});

export default MonthYearPicker;

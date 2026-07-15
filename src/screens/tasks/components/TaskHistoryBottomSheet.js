import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  activeTaskHistory,
  taskHistoryBottomSheetRef,
} from "../utils/taskHistoryBottomSheetService";
import { useState } from "react";
import {
  getTaskHistoryStageColor,
  getTaskHistoryStageDisplayText,
} from "../utils/taskFunctions";
import TimelineDot from "./TimelineDot";
import { ArrowRight } from "@/svg";
import { Colors, SH, SW, SF, formatDate } from "@/utils";
import { StyleSheet, Text, View } from "react-native";
import { primaryColors } from "@/design/colors";
import { body } from "@/design/typography";
export const TaskHistoryBottomSheet = () => {
  const snapPoints = ["90%"];
  const [task, setTask] = useState(null);
  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={taskHistoryBottomSheetRef}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose={true}
      detached={false}
      enableContentPanningGesture={false}
      enableBlurKeyboardOnGesture={false}
      enableHandlePanningGesture={true}
      onAnimate={(fromIndex, toIndex) => {
        if (fromIndex === -1 && toIndex === 0) {
          setTask(activeTaskHistory.current);
        }
      }}
      backdropComponent={(props) => {
        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0} // backdrop visible when sheet index >= 0
            disappearsOnIndex={-1} // hidden when index = -1
            opacity={0.5} // dim amount
          />
        );
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.sheetTitle}>History for {task?.title}</Text>
      </View>
      <BottomSheetScrollView style={styles.sheetContent}>
        {task?.stage_history.length > 0 ? (
          task?.stage_history?.map((h, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                gap: 12,
              }}
            >
              {/* <TimelineDot color={getTaskHistoryStageColor(h.new_stage).text} /> */}
              <TimelineDot
                color={primaryColors.gray[25]}
                borderColor={primaryColors.gray[300]}
                circleShadow={false}
                width={16}
                height={16}
              />
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  borderColor: Colors.gray_line_color,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderRadius: 8,
                  padding: 8,
                  flex: 1,
                  gap: 12,
                  marginVertical: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      ...body.sm.medium,
                      color: getTaskHistoryStageColor(h.old_stage).text,
                      backgroundColor: getTaskHistoryStageColor(h.old_stage)
                        .background,
                      paddingHorizontal: SH(12),
                      paddingVertical: SH(6),
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    {getTaskHistoryStageDisplayText(h.old_stage)}
                  </Text>
                  <ArrowRight
                    stroke={Colors.black_text_color}
                    strokeWidth={0.1}
                    fill={Colors.black_text_color}
                    width={12}
                    height={12}
                  />
                  <Text
                    style={{
                      ...body.sm.medium,
                      color: getTaskHistoryStageColor(h.new_stage).text,
                      backgroundColor: getTaskHistoryStageColor(h.new_stage)
                        .background,
                      paddingHorizontal: SH(12),
                      paddingVertical: SH(6),
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    {getTaskHistoryStageDisplayText(h.new_stage)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        ...body.xs.medium,
                        color: Colors.gray_text_color,
                        marginBottom: SH(2),
                        paddingLeft: SH(6),
                        height: "100%",
                      }}
                    >
                      By {h.changed_by_details?.name}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      fontSize: SF(8),
                      color: Colors.gray_text_color,
                      marginHorizontal: SH(2),
                    }}
                  >
                    ●
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        ...body.xs.medium,
                        color: Colors.gray_text_color,
                        marginBottom: SH(2),
                        height: "100%",
                      }}
                    >
                      On {formatDate(h.changed_at)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No history available</Text>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = {
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SH(4),
    paddingHorizontal: SW(8),
    borderRadius: SW(4),
    backgroundColor: Colors.gray_background || "#F2F2F2",
    borderWidth: 1,
    borderColor: Colors.gray_line_color,
    alignSelf: "flex-start",
  },
  chipText: {
    fontFamily: "Inter-Regular",
    fontSize: SF(13),
    color: Colors.black_text_color,
  },
  pressableChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SH(4),
    paddingHorizontal: SW(8),
    borderRadius: SW(12),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
  },
  pressableChipText: {
    fontFamily: "Inter-Regular",
    fontSize: SF(12),
    color: Colors.primary,
  },
  avatarCircle: {
    width: SW(18),
    height: SW(18),
    borderRadius: SW(9),
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SW(6),
  },
  avatarText: {
    fontFamily: "Inter-Bold",
    fontSize: SF(10),
    color: Colors.white_text_color,
  },
  popoverContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 12,
    justifyContent: "center",
    alignSelf: "center",
  },
  popoverTitle: {
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  ccItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  ccName: {
    fontFamily: "Inter-Medium",
    fontSize: SF(14),
    color: Colors.gray_text_color,
  },
  separator: {
    height: 12,
  },
  emptyText: {
    fontFamily: "Inter-Medium",
    fontSize: SF(14),
    color: Colors.gray_text_color,
  },
  container: {
    borderWidth: 0,
    height: 28,
  },
  dropdown: {
    borderWidth: 1,
    paddingVertical: SH(10),
    paddingHorizontal: SW(15),
    fontSize: SF(14),
    fontFamily: "Inter-SemiBold",
    color: Colors.primary,
    backgroundColor: Colors.theme_background,
    marginBottom: SH(0),
    borderColor: Colors.primary,
    height: "100%",
    borderRadius: 60,
    paddingVertical: 0,
    width: 130,
  },
  placeholderStyle: {
    fontSize: SF(12),
    fontFamily: "Inter-Regular",
    backgroundColor: Colors.theme_background,
    color: Colors.primary,
  },
  selectedTextStyle: {
    fontSize: SF(12),
    color: Colors.gray_text_color,
    fontFamily: "Inter-Regular",
    backgroundColor: Colors.theme_background,
  },
  selectedStyle: {
    backgroundColor: Colors.theme_background,
  },
  item: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingVertical: SH(10),
    paddingHorizontal: SW(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_line_color,
    backgroundColor: Colors.theme_background,
  },
  containerStyle: {
    borderRadius: SW(5),
    backgroundColor: Colors.theme_background,
    borderWidth: 0,
  },
  searchStyle: {
    borderRadius: 10,
    borderColor: Colors.primary,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownItemText: {
    fontSize: 14,
  },
  sheetContent: {
    height: "100%",
    paddingHorizontal: 20,
    topBorderColor: Colors.gray_line_color,
    topBorderWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  historyItem: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  historyText: {
    fontSize: 14,
    color: "#333",
  },
  historyDate: {
    fontSize: 12,
    color: "#666",
  },
};

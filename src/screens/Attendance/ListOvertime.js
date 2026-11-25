import React from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  StyleSheet,
  I18nManager,
} from "react-native";
import { RenderAttendance } from "./components/attendance/RenderAttendance";
import {
  EmptyContent,
  LoadingIndicatorFooter,
} from "../../components/UI/GeneralComponents";
import { Colors } from "../../utils";
import { SH, SW } from "../../utils";
import { AttendanceSummaryCard } from "./components/attendance/AttendanceSummaryCard";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { RenderOvertime } from "./components/overtime/RenderOvertime";

export const ListOvertime = ({
  overtimeData,
  refreshing,
  refreshCurrentData,
  loading,
}) => {
  return (
    <>
      {loading ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <LoadingIndicatorFooter />
        </View>
      ) : (
        <FlatList
          data={overtimeData}
          horizontal={false}
          scrollEnabled={true}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <RenderOvertime overtime={item} />}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: SH(100),
              flex: overtimeData.length < 1 ? 1 : 0,
            },
          ]}
          onEndReachedThreshold={0.8}
          ListEmptyComponent={
            <EmptyContent onPress={() => refreshCurrentData()} />
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => await refreshCurrentData()}
              tintColor={primaryColors.brand[1000]}
              colors={[primaryColors.brand[1000]]}
              progressBackgroundColor={Colors.white}
            />
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  summaryScroll: {
    height: SH(96),
    maxHeight: SH(96),
    minHeight: SH(96),
    marginBottom: SH(8),
  },
  summaryScrollContent: {
    flexDirection: "row",
    gap: SW(12),
    paddingHorizontal: SW(12),
    paddingVertical: SH(4),
    flexGrow: 1,
  },
  listContent: {
    minWidth: "100%",
    paddingHorizontal: SW(12),
    marginTop: SH(4),
  },
});

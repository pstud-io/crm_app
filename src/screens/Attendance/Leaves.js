import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Shadow } from "react-native-shadow-2";
import Toast from "react-native-toast-message";
import { Button } from "../../components/common";
import { LeaveSummaryCard } from "./components/leaves/LeaveSummaryCard";
import { LeaveCard } from "./components/leaves/LeaveCard";
import { RequestLeaveBottomSheet } from "./components/leaves/RequestLeaveBottomSheet";
import { Colors, SH, SW } from "../../utils";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { body } from "../../components/UI/DesignSystem/typography";
import { useLeaveEndpoints } from "./hooks/useLeavesEndpoints";
import { useFocusEffect } from "@react-navigation/native";
import { formElementsStyles } from "../../components/UI/Dropdown/formElementStyles";
import { openRequestLeaveBottomSheet } from "./utils/requestLeaveBottomSheetRef";
import { LoadingIndicatorFooter } from "../../components/UI/GeneralComponents";

export const Leaves = () => {
  const [leavesData, setLeavesData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { getUserLeaves, getLeaveSummary } = useLeaveEndpoints();

  const setListLoadState = useCallback((isLoading) => {
    setInitialLoading(isLoading);
  }, []);

  const setSummaryLoadState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const fetchData = async () => {
    await Promise.all([
      getUserLeaves(setListLoadState, setLeavesData),
      getLeaveSummary(setSummaryLoadState, setSummaryData),
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleApplySuccess = () => {
    onRefresh();
  };

  const calculateAvailableLeaves = () => {
    const summary = summaryData || {};

    const totalAvailableLeaves =
      (summary.sick_leaves || 0) +
      (summary.paid_leaves || 0) +
      (summary.casual_leaves || 0);

    const casualUsed = summary.casual_leaves_used || 0;
    const sickUsed = summary.sick_leaves_used || 0;
    const paidLeavesUsed = summary.paid_leaves_used || 0;
    const totalUsed = sickUsed + casualUsed + paidLeavesUsed;
    const availableLeavesCount = totalAvailableLeaves - totalUsed;
    return availableLeavesCount;
  };

  const leaveSummaryData = React.useMemo(() => {
    if (!summaryData) {
      return [
        { title: "Total Leaves", value: "...", subTitle: "" },
        { title: "Available Leaves", value: "...", subTitle: "" },
        { title: "Total Used", value: "...", subTitle: "" },
      ];
    }

    const totalAllotted =
      (summaryData.sick_leaves || 0) +
      (summaryData.paid_leaves || 0) +
      (summaryData.casual_leaves || 0);

    const totalUsed =
      (summaryData.sick_leaves_used || 0) +
      (summaryData.casual_leaves_used || 0) +
      (summaryData.paid_leaves_used || 0);

    const availableTotal = totalAllotted - totalUsed;

    return [
      {
        title: "Total Leaves",
        value: totalAllotted,
        subTitle: "Allotted",
      },
      {
        title: "Available Leaves",
        value: availableTotal,
        subTitle: "Remaining",
      },
      {
        title: "Total Used",
        value: totalUsed,
        subTitle: "Consumed",
      },
    ];
  }, [summaryData]);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <FlatList
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: SW(12),
            overflow: "visible",
            paddingHorizontal: SW(12),
            paddingVertical: SH(4),
          }}
          horizontal
          style={{ flexGrow: 0 }}
          showsHorizontalScrollIndicator={false}
          data={leaveSummaryData}
          renderItem={({ item }) => (
            <LeaveSummaryCard
              title={item.title}
              value={item.value}
              subTitle={item.subTitle}
              loading={loading}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      {initialLoading && leavesData.length === 0 ? (
        <View style={styles.centerContent}>
          <LoadingIndicatorFooter />
        </View>
      ) : (
        <FlatList
          data={leavesData}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <LeaveCard leave={item} onRefresh={onRefresh} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primaryColors.brand[1000]}
              colors={[primaryColors.brand[1000]]}
              progressBackgroundColor={Colors.white}
            />
          }
          ListEmptyComponent={() =>
            !initialLoading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.statusText}>No leave records found.</Text>
              </View>
            )
          }
        />
      )}

      {/* Floating Button Container */}
      {/* <View style={styles.floatingButtonWrapper}>
        <Shadow
          style={{ borderRadius: SW(12) }}
          distance={SW(9)}
          startColor="#E5E7EB"
          offset={[SW(2), SW(2)]}
        >
          <Button
            title={"Apply Leave"}
            buttonStyle={formElementsStyles.floatingButton}
            color={primaryColors.button.active}
            titleStyle={{ ...body.md.semiBold }}
            onPress={() => openRequestLeaveBottomSheet()}
          />
        </Shadow>
      </View> */}

      <RequestLeaveBottomSheet
        onApplySuccess={handleApplySuccess}
        availableBalance={calculateAvailableLeaves()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    marginBottom: SH(16),
  },
  listContent: {
    paddingHorizontal: SW(16),
    paddingBottom: SH(90), // Spacing for the floating button
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...body.sm.regular,
    color: primaryColors.gray[600],
    marginTop: SH(10),
  },
  emptyContainer: {
    paddingTop: SH(50),
    alignItems: "center",
  },
  statusText: {
    ...body.sm.regular,
    color: primaryColors.gray[600],
  },
  floatingButtonWrapper: {
    position: "absolute",
    bottom: SH(20),
    right: SW(20),
    zIndex: 999,
  },
});

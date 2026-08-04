import { FlatList, ScrollView, Text, View } from "react-native";
import { SH, SW } from "../../utils";
import { useEffect, useState } from "react";
import { usePayrollEndpoints } from "./hooks/usePayrollEndpoints";
import { PayrollSummaryCard } from "./components/payroll/PayrollSummaryCard";
import { EmptyContent } from "../../components/UI/GeneralComponents";
import { RenderPayroll } from "./components/payroll/RenderPayroll";

export const Payroll = ({ payrollSummaryData, payrollData, loading }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        flexGrow: 1,
        gap: SH(12),
      }}
    >
      <FlatList
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: SW(12),
          overflow: "visible",
          paddingHorizontal: SW(12),
          paddingVertical: SH(4),
        }}
        horizontal={true}
        style={{ flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        data={payrollSummaryData}
        renderItem={({ item, index }) => {
          return (
            <PayrollSummaryCard
              title={item.title}
              value={item.value}
              subTitle={item.subTitle}
              loading={loading.fetchingPayrollSummary}
            />
          );
        }}
        keyExtractor={(item, index) => index}
      />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: SW(12),
          paddingBottom: SH(64),
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexGrow: 1,
        }}
        style={{ flex: 1, width: "100%" }}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={payrollData}
        renderItem={({ item, index }) => {
          return <RenderPayroll payroll={item} />;
        }}
        ListEmptyComponent={<EmptyContent onPress={() => null} />}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

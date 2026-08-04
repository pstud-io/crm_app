import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SH, SW } from "../../../../utils";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";

export const AttendanceSummaryCard = ({ title, value, subTitle, loading }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: loading ? "center" : "space-between",
        alignItems: loading ? "center" : "flex-start",
        paddingHorizontal: SW(16),
        paddingVertical: subTitle ? SH(12) : SH(16),
        borderColor: primaryColors.gray[200],
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: SW(16),
        backgroundColor: "white",
        width: SW(160),
        height: "100%",
        shadowColor: "#0A0D12",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={primaryColors.brand[1000]} size={16} />
      ) : (
        <>
          <Text style={{ ...body.sm.regular, color: primaryColors.gray[600] }}>
            {title}
          </Text>
          <Text style={{ ...body.xl.semiBold, color: primaryColors.gray[900] }}>
            {value}
          </Text>
          {subTitle && (
            <Text style={{ ...body.xs.medium, color: primaryColors.gray[800] }}>
              {subTitle}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SH, SW } from "../../../../utils";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import {
  getMonth,
  getPayrollStatusColor,
  handleDownloadPayroll,
} from "../../utils/payrollGeneralFunctions";
import { Badge } from "../../../../components/UI/Badge/Badge";
import { DownloadOutlineIcon } from "../../../../svg";
import { ItemSeparatorComponent } from "../../../../components/UI/GeneralComponents/ItemSeperatorComponent";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserNavigationProp } from "@/navigation/UserNavigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AttendanceStackParamList } from "@/navigation/AttendanceNavigation";
import { RootState } from "@/store/store";

export const RenderPayroll = ({ payroll, hasIcons = true }: any) => {
  const navigation = useNavigation<UserNavigationProp>();
  const [loading, setLoading] = useState({
    downloadingPayroll: false,
  });
  const organization_id = useSelector(
    (state: RootState) => state.profile.organization_id,
  );

  if (payroll.status === "Pending") {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        navigation.push("Attendance", {
          screen: "PayrollDetailView",
          params: {
            payroll: payroll,
          },
        });
      }}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeColumn}>
          <Badge
            size={"sm"}
            text={payroll.status}
            color={getPayrollStatusColor(payroll.status.toLowerCase())}
          />
          <Text style={styles.dateText}>
            {getMonth(payroll.month) + " " + payroll.year}
          </Text>
        </View>
        {hasIcons && (
          <TouchableOpacity
            onPress={() =>
              handleDownloadPayroll(setLoading, payroll.id, organization_id)
            }
          >
            {loading.downloadingPayroll ? (
              <ActivityIndicator
                size={SW(16)}
                color={primaryColors.brand[1000]}
              />
            ) : (
              <DownloadOutlineIcon
                width={SH(20)}
                height={SH(20)}
                stroke={primaryColors.brand[1000]}
                strokeWidth={SW(1.5)}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <ItemSeparatorComponent
        direction={"horizontal"}
        style={{ marginVertical: SH(6) }}
      />

      <View style={styles.footerRow}>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Net Pay</Text>
          <Text style={styles.value}>{payroll.amount_payable}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Paid</Text>
          <Text style={styles.value}>{payroll.amount_paid}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>PF + Tax</Text>
          <Text style={styles.value}>{payroll.deductions || "NA"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: SW(16),
    borderColor: primaryColors.gray[200],
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: SW(15),
    paddingVertical: SH(16),
    marginBottom: SH(16),
    shadowColor: "#0A0D12",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: "white",
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  badgeColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: SH(8),
  },
  dateText: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  infoGroup: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: SH(4),
  },
  label: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
  },
  value: {
    ...body.sm.semiBold,
    color: primaryColors.brand[1000],
  },
});

{
  /* <ItemSeparatorComponent direction={"horizontal"} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: SH(4),
          }}
        >
          <Text style={{ ...body.xs.regular, color: primaryColors.gray[600] }}>
            Credited On
          </Text>
          <Text style={{ ...body.sm.medium, color: primaryColors.gray[700] }}>
            {badFormatDate(payroll.created_on)}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: SH(4),
          }}
        >
          <Text style={{ ...body.xs.regular, color: primaryColors.gray[600] }}>
            Credited To
          </Text>
          <Text style={{ ...body.sm.medium, color: primaryColors.gray[700] }}>
            xxxxxx6565
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: SH(4),
          }}
        >
          <Text style={{ ...body.xs.regular, color: primaryColors.gray[600] }}>
            Bank Name
          </Text>
          <Text style={{ ...body.sm.medium, color: primaryColors.gray[700] }}>
            {"HDFC"}
          </Text>
        </View>
      </View> */
}

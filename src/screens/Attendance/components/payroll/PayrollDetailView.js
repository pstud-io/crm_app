import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SH, SW } from "../../../../utils";
import { primaryColors } from "../../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../../components/UI/DesignSystem/typography";
import { DownloadOutlineIcon } from "../../../../svg";
import { handleDownloadPayroll } from "../../utils/payrollGeneralFunctions";
import { useSelector } from "react-redux";

const PayrollDetailView = ({ route }) => {
  const { payroll } = route.params;
  const organization_id = useSelector((state) => state.profile.organization_id);

  console.log("====================================");
  console.log(payroll);
  console.log("====================================");

  const [loading, setLoading] = useState({
    downloadingPayroll: false,
  });

  const attendance = parseFloat(payroll?.attendance_days || 0);
  const holidays = parseFloat(payroll?.holidays || 0);
  const regularized = parseFloat(payroll?.regularized_days || 0);
  const weekends = parseFloat(payroll?.weekends || 0);

  const working_day = (
    attendance +
    holidays +
    regularized +
    weekends
  ).toString();

  const net_pay =
    parseFloat(payroll?.gross_monthly_salary || 0) +
    parseFloat(payroll?.variable_pay || 0) -
    parseFloat(payroll?.deductions || 0);

  const InfoRow = ({
    label,
    value,
    isBold = false,
    color = primaryColors.gray[700],
    showDivider = true,
  }) => (
    <>
      <View style={styles.infoRow}>
        <Text style={{ ...body.sm.regular, color: primaryColors.gray[600] }}>
          {label}
        </Text>
        <Text
          style={{
            ...body.sm.medium,
            color: color,
            fontWeight: isBold ? "700" : "500",
          }}
        >
          {value}
        </Text>
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        {/* User Section with Download Button */}
        <View style={styles.userSectionContainer}>
          <View style={styles.userLeftSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {payroll.organization_contact_details?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View>
              <Text style={{ ...body.md.bold, color: primaryColors.gray[900] }}>
                {payroll.organization_contact_details?.name}
              </Text>
              <Text
                style={{ ...body.xs.regular, color: primaryColors.gray[500] }}
              >
                {payroll.organization_contact_details?.phone}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              handleDownloadPayroll(setLoading, payroll.id, organization_id)
            }
            disabled={loading.downloadingPayroll}
            style={styles.downloadButton}
          >
            {loading.downloadingPayroll ? (
              <ActivityIndicator
                size={SW(18)}
                color={primaryColors.brand[1000]}
              />
            ) : (
              <DownloadOutlineIcon
                width={SH(22)}
                height={SH(22)}
                stroke={primaryColors.brand[1000]}
                strokeWidth={SW(2)}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Salary Card */}
        <View style={styles.salaryCard}>
          <View style={styles.infoRow}>
            <Text
              style={{ ...body.sm.regular, color: primaryColors.gray[600] }}
            >
              Gross Salary
            </Text>
            <Text style={{ ...body.sm.medium, color: primaryColors.gray[700] }}>
              ₹{payroll.gross_monthly_salary}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{ ...body.sm.regular, color: primaryColors.gray[600] }}
            >
              Variable Pay
            </Text>
            <Text
              style={{ ...body.sm.medium, color: primaryColors.success[700] }}
            >
              + ₹{payroll.variable_pay || "0"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{ ...body.sm.regular, color: primaryColors.gray[600] }}
            >
              Deductions
            </Text>
            <Text
              style={{ ...body.sm.medium, color: primaryColors.error[600] }}
            >
              - ₹{payroll.deductions}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={{ ...body.md.bold, color: primaryColors.gray[900] }}>
              Net Pay
            </Text>
            <Text style={{ ...body.md.bold, color: primaryColors.gray[600] }}>
              ₹{net_pay}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={{ ...body.md.bold, color: primaryColors.gray[900] }}>
              Amount Payable
            </Text>
            <Text style={{ ...body.md.bold, color: primaryColors.gray[600] }}>
              ₹{payroll.amount_payable}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={{ ...body.md.bold, color: primaryColors.gray[900] }}>
              Amount Paid
            </Text>
            <Text
              style={{ ...body.md.bold, color: primaryColors.success[600] }}
            >
              ₹{payroll.amount_paid}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionBox}>
          <Text style={{ ...body.sm.regular, color: primaryColors.gray[700] }}>
            {payroll.description || "No description provided"}
          </Text>
        </View>

        {/* Additional Details Card */}
        <Text style={styles.sectionTitle}>Additional Details</Text>
        <View style={styles.detailsCard}>
          <InfoRow label="Working Days" value={working_day} />
          <InfoRow
            label="Unpaid Leaves"
            value={
              payroll.attendance_days === "0.00" ? "0" : payroll.attendance_days
            }
          />
          <InfoRow
            label="Approved Leaves"
            value={payroll.approved_leaves}
            showDivider={false}
          />
          {/* <InfoRow
            label="Wallet Balance"
            value={`₹${payroll.wallet_balance_details?.wallet_balance || "0"}`}
            showDivider={false}
          /> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColors.gray[50],
  },
  headerCard: {
    padding: SW(20),
  },
  userSectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SH(24),
  },
  userLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SW(12),
  },
  downloadButton: {
    backgroundColor: primaryColors.gray[50],
    padding: SW(10),
    borderRadius: SW(10),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
  },
  avatar: {
    width: SW(48),
    height: SW(48),
    borderRadius: SW(24),
    backgroundColor: primaryColors.gray[50],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: primaryColors.gray[600],
    fontWeight: "700",
    fontSize: 16,
  },
  salaryCard: {
    backgroundColor: "white",
    borderRadius: SW(12),
    padding: SW(16),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    marginBottom: SH(24),
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SH(8),
  },
  divider: {
    height: 1,
    backgroundColor: primaryColors.gray[100],
    marginVertical: SH(2),
  },
  sectionTitle: {
    ...body.sm.bold,
    color: primaryColors.gray[900],
    marginBottom: SH(12),
  },
  descriptionBox: {
    backgroundColor: "white",
    borderRadius: SW(12),
    padding: SW(16),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    minHeight: SH(100),
    marginBottom: SH(24),
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: SW(12),
    padding: SW(16),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    marginBottom: SH(24),
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default PayrollDetailView;

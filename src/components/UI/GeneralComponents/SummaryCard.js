import { Text, View, ActivityIndicator } from "react-native";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";
import { Colors } from "../../../utils"; // Ensure Colors is imported

export const SummaryCard = ({ dataSet, loading, type }) => {
  const set =
    type === "pr" ? dataSet?.payment_requests : dataSet?.payment_expenses;

  const data = {
    requested:
      type === "pr" ? set?.total_requested_amount : set?.total_expenses,
    approved:
      type === "pr" ? set?.total_paid_amount : set?.total_approved_expenses,
  };

  const formatAmount = (amount) => {
    const val = parseFloat(amount || 0);
    return `₹${val.toFixed(0)}`;
  };

  const LoadingSkeleton = () => (
    <ActivityIndicator size={SW(20)} color={primaryColors.gray[900]} />
  );

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: SW(16),
        borderColor: primaryColors.gray[200],
        borderWidth: SW(1),
        borderRadius: SW(8),
        backgroundColor: "white",
        shadowColor: "#0A0D12",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: SH(16),
        }}
      >
        <Text style={{ ...body.md.regular, color: primaryColors.gray[600] }}>
          Requested
        </Text>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Text style={{ ...body.md.semiBold, color: primaryColors.gray[900] }}>
            {formatAmount(data.requested)}
          </Text>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: SH(16),
        }}
      >
        <Text style={{ ...body.md.regular, color: primaryColors.gray[600] }}>
          {type === "pr" ? "Received" : "Approved"}
        </Text>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Text style={{ ...body.md.semiBold, color: primaryColors.gray[900] }}>
            {formatAmount(data.approved)}
          </Text>
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: SH(16),
        }}
      >
        <Text style={{ ...body.md.regular, color: primaryColors.gray[600] }}>
          My Wallet
        </Text>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Text style={{ ...body.md.semiBold, color: primaryColors.gray[900] }}>
            {dataSet?.org_wallet?.wallet_balance}
          </Text>
        )}
      </View>
    </View>
  );
};

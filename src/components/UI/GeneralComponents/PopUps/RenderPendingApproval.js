import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ViewApproversPopover } from "../../../../screens/Files/components/ViewApproversPopover";
import badgeColors from "../../Badge/badgeColors";
import { Badge } from "../../Badge/Badge";
import { primaryColors } from "../../DesignSystem/colorPalette";
import {
  badFormatDate,
  capitalizeEachWord,
  Colors,
  SH,
  SW,
} from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { CloseOutlineIcon, TickOutline, UserOutline } from "../../../../svg";
import { useState } from "react";
import { useGeneralEndpoints } from "../../../../hooks/useGeneralEndpoints";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ApproveRejectButton } from "../ApproveRejectButton";

export const RenderPendingApproval = ({
  item,
  setVisible,
  setActiveItem,
  onRefresh,
  viewPendingApprovalsRef,
}) => {
  console.log("This is the pending approval", item);
  const profile = useSelector((state) => state.profile);
  const navigation = useNavigation();
  let approvalStatusID = "";
  const canApproveReject = item.approval_status_details.some((approval) => {
    const sameUser =
      approval?.organization_contact_details?.id ===
      profile?.organization_contact_id;
    if (sameUser) {
      approvalStatusID = approval?.id;
    }
    const sameRole = approval?.role_details?.id === profile?.fk_user_role;
    if (sameRole) {
      approvalStatusID = approval?.id;
    }
    const isPending = approval?.status === "pending";
    return (sameUser || sameRole) && isPending;
  });
  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);
  const { handleApproveRejectApprovals, navigateToContext } =
    useGeneralEndpoints();
  const handleNavigation = async () => {
    const context_type =
      item.context_type === "expense" ? "payment-proof" : "payment_request";
    navigateToContext({
      context_type: context_type,
      context_id: item.context_id,
    });
    viewPendingApprovalsRef.current.requestClose();
  };
  return (
    <TouchableOpacity
      onPress={handleNavigation}
      activeOpacity={0.9}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderColor: primaryColors.gray[200],
        borderRadius: SW(16),
        borderWidth: StyleSheet.hairlineWidth,
        width: "100%",
        paddingHorizontal: SW(16),
        paddingVertical: SH(16),
        gap: SH(16),
        backgroundColor: Colors.theme_background,
        elevation: 1,
        shadowColor: "#0A0D12",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}>
          {capitalizeEachWord(item.context_details.title)}
        </Text>
        <Badge
          size={"sm"}
          text={`Approver Level - ${item.level}`}
          color={badgeColors.blueGray}
        />
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: SW(20),
        }}
      >
        {/* Assigned To */}
        <View
          style={{
            display: "flex",
            gap: SH(4),
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Project
          </Text>
          <Text
            style={{
              ...body.sm.semiBold,
              color: primaryColors.brand[1000],
            }}
          >
            {item?.project_detail.project_name}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: SH(4),
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Amount
          </Text>
          <Text
            style={{
              ...body.sm.semiBold,
              color: primaryColors.brand[1000],
            }}
          >
            ₹{item.context_details.amount}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: SW(20),
        }}
      >
        {/* Assigned To */}
        <View
          style={{
            display: "flex",
            gap: SH(4),
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Created By
          </Text>
          <Text
            style={{
              ...body.sm.semiBold,
              color: primaryColors.brand[1000],
            }}
          >
            {item?.creator_contact_details?.name || "Unknown"}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            gap: SH(4),
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            Created On
          </Text>
          <Text
            style={{
              ...body.sm.semiBold,
              color: primaryColors.brand[1000],
            }}
          >
            {badFormatDate(item?.created_on)}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{}}
          onPress={() => {
            setActiveItem(item);
            setVisible(true);
          }}
        >
          <Badge
            text={`All approvers`}
            size={"sm"}
            color={badgeColors.blueGray}
            border={false}
          />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            justifyContent: "flex-end",
            gap: SW(8),
          }}
        >
          {canApproveReject && (
            <>
              <ApproveRejectButton
                badge={true}
                approve={false}
                loading={rejecting}
                onPress={async () => {
                  await handleApproveRejectApprovals(
                    setRejecting,
                    "reject",
                    approvalStatusID,
                    onRefresh,
                  );
                }}
              />
              <ApproveRejectButton
                badge={true}
                approve={true}
                loading={approving}
                onPress={async () => {
                  await handleApproveRejectApprovals(
                    setApproving,
                    "approve",
                    approvalStatusID,
                    onRefresh,
                  );
                }}
              />
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

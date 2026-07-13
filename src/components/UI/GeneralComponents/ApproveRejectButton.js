import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { formElementsStyles } from "../Dropdown/formElementStyles";
import { Badge } from "../Badge/Badge";
import badgeColors from "../Badge/badgeColors";
import { CloseOutlineIcon, TickOutline } from "../../../svg";
import { primaryColors } from "../DesignSystem/colorPalette";
import { SH, SW } from "../../../utils";
import { body } from "../DesignSystem/typography";

export const ApproveRejectButton = ({ onPress, badge, approve, loading }) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        await onPress();
      }}
      disabled={loading}
      activeOpacity={0.9}
      style={
        badge
          ? {}
          : approve
            ? formElementsStyles.approveButton
            : formElementsStyles.rejectButton
      }
    >
      {badge && (
        <Badge
          text={approve ? `Approve` : "Reject"}
          size={"sm"}
          color={approve ? badgeColors.success : badgeColors.error}
          border={false}
          iconLeft={
            loading ? (
              <ActivityIndicator
                size={12}
                color={
                  approve ? badgeColors.success.text : badgeColors.error.text
                }
              />
            ) : approve ? (
              <TickOutline
                width={SW(16)}
                height={SH(16)}
                stroke={badgeColors.success.text}
                strokeWidth={2}
              />
            ) : (
              <CloseOutlineIcon
                width={SW(10)}
                height={SH(10)}
                stroke={badgeColors.error.text}
                strokeWidth={0}
                fill={badgeColors.error.text}
              />
            )
          }
        />
      )}
      {!badge && (
        <>
          {loading ? (
            <ActivityIndicator
              size={12}
              color={
                approve ? primaryColors.success[600] : primaryColors.error[600]
              }
            />
          ) : approve ? (
            <TickOutline
              width={SW(14)}
              height={SH(14)}
              stroke={primaryColors.success[600]}
              strokeWidth={2}
            />
          ) : (
            <CloseOutlineIcon
              width={SH(10)}
              height={SH(10)}
              stroke={primaryColors.error[600]}
              fill={primaryColors.error[600]}
              strokeWidth={StyleSheet.hairlineWidth}
            />
          )}
          <Text
            style={{
              ...body.sm.medium,
              color: approve
                ? primaryColors.success[600]
                : primaryColors.error[600],
            }}
          >
            {approve ? "Approve" : "Reject"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

import { primaryColors } from "@/components/UI/DesignSystem/colorPalette";
import { body } from "@/components/UI/DesignSystem/typography";
import { RenderAssets } from "@/components/UI/GeneralComponents/RenderAssets";
import { SH, SW } from "@/utils";
import { Text, TouchableOpacity } from "react-native";

const UserDetailsCard = ({
  label,
  value,
  hasBorder = true,
  type = "value",
}) => {
  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: SW(8),
        justifyContent: "space-between",
        paddingHorizontal: SW(12),
        alignSelf: "flex-start",
        paddingVertical: SH(12),
        height: type === "address" ? undefined : SH(50),
        width: "100%",
        borderBottomWidth: hasBorder ? 1 : 0,
        borderBottomColor: primaryColors.gray[200],
      }}
      onPress={() => {}}
    >
      {type !== "address" && (
        <Text
          style={{
            ...body.sm.medium,
            color: primaryColors.gray[700],
          }}
        >
          {label}
        </Text>
      )}
      {type === "value" && (
        <>
          {console.log("Value is ", label, value)}
          <Text
            style={{
              ...body.sm.medium,
              color: primaryColors.gray[700],
            }}
          >
            {value || "NA"}
          </Text>
        </>
      )}
      {type === "address" && (
        <Text
          style={{
            ...body.sm.medium,
            color: primaryColors.gray[700],
          }}
          numberOfLines={8}
        >
          {value || "NA"}
        </Text>
      )}
      {type === "asset" && (
        <>
          {value?.url ? (
            <RenderAssets
              imageSize={SW(20)}
              assets={[value]}
              marginRight={0}
              style={{ alignSelf: "center", flexGrow: 0 }}
            />
          ) : (
            <Text
              style={{
                ...body.sm.medium,
                color: primaryColors.gray[700],
              }}
              numberOfLines={8}
            >
              {"NA"}
            </Text>
          )}
        </>
      )}
      {type === "checkbox" && (
        <Text
          style={{
            ...body.sm.medium,
            color: primaryColors.gray[700],
          }}
          numberOfLines={8}
        >
          {value ? "Yes" : "False"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default UserDetailsCard;

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSyncEndpoints } from "../../../../hooks/sync/useSyncEndpoints";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { ReloadOutline } from "../../../../svg";
import { SF, SH, SW } from "../../../../utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const SyncIcon = ({ count = 0 }) => {
  const isSyncing = useSelector((state) => state.isSyncing.isSyncing);
  const { syncAll } = useSyncEndpoints();
  return (
    <>
      <TouchableOpacity
        onPress={async () => await syncAll("Icon click")}
        disabled={isSyncing}
        style={{
          //   height: "100%",
          //   alignItems: "flex-end",
          //   display: "flex",
          //   flexDirection: "row",
          position: "relative",
        }}
      >
        <View
          style={{
            display: "flex",
            width: count < 10 ? SH(18) : "auto",
            height: SH(18),
            backgroundColor: primaryColors.brand[1000],
            borderRadius: SH(999),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: SH(6),
            right: count < 10 ? -SW(8) : -SW(8),
            zIndex: 100,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: SF(8),
              fontWeight: "700",
              fontFamily: "Inter-Regular",
            }}
          >
            {count}
          </Text>
        </View>
        {isSyncing ? (
          <ActivityIndicator size={14} color={primaryColors.brand[1000]} />
        ) : (
          <ReloadOutline
            width={SH(18)}
            height={SH(18)}
            stroke={primaryColors.brand[1000]}
            fill={primaryColors.brand[1000]}
            strokeWidth={0}
          />
        )}
        <View
          style={{
            display: "flex",
            minWidth: SH(24),
            height: SH(12),
            paddingHorizontal: SW(2),
            backgroundColor: primaryColors.brand[1000],
            borderRadius: SH(999),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: SH(8),
            right: -SW(10),
            zIndex: 100,
            opacity: 0,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: SF(8),
              fontWeight: "700",
              textAlign: "center",
              includeFontPadding: false,
              textAlignVertical: "center",
              fontFamily: "Inter-Regular",
              flexShrink: 0,
            }}
            numberOfLines={1}
          >
            {"222"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

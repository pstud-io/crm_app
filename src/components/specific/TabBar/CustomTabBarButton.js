import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SH } from "../../../utils";
import { body } from "../../UI/DesignSystem/typography";
import { primaryColors } from "../../UI/DesignSystem/colorPalette";
import { handleMenuNavigation } from "../../../utils/ModulesData";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSubButtonGlobal } from "../../../store/slices/activeSubButtonGlobal";
const CustomTabBarButton = ({ tab, onPress, totalTabsRenderedOnScreen }) => {
  const activeTabButtonID = useSelector(
    (state) => state.activeSubButtonGlobal.activeSubButtonGlobal,
  );
  const isActive = activeTabButtonID === tab.id;
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      key={tab.id}
      onPress={async () => {
        dispatch(setActiveSubButtonGlobal(tab.id));
        await onPress();
      }}
      style={totalTabsRenderedOnScreen < 5 ? styles.grow : styles.dontGrow}
    >
      {tab.icon(isActive)}
      <Text
        style={{
          ...body.xs.medium,
          color: isActive ? primaryColors.brand[1000] : primaryColors.gray[500],
        }}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  grow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexGrow: 1,
    gap: SH(8),
  },
  dontGrow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexGrow: 1,
    gap: SH(8),
    maxWidth: "20%",
  },
});

export default CustomTabBarButton;

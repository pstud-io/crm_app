import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SH, SW } from "../../../utils";
import { MenuOutline } from "../../../svg";
import { primaryColors } from "../../UI/DesignSystem/colorPalette";
import { body } from "../../UI/DesignSystem/typography";
import { useSelector } from "react-redux";
const MenuDrawer = ({ setOpen, menuModules, totalTabsRenderedOnScreen }) => {
  const activeTabButtonID = useSelector(
    (state) => state.activeSubButtonGlobal.activeSubButtonGlobal,
  );
  const isActive = menuModules.some(
    (module) => module.id === activeTabButtonID,
  );
  return (
    <TouchableOpacity
      key={"more_modal_popover"}
      onPress={() => setOpen((prev) => !prev)}
      style={totalTabsRenderedOnScreen < 5 ? styles.grow : styles.dontGrow}
    >
      <MenuOutline
        width={SW(24)}
        height={SH(24)}
        stroke={isActive ? primaryColors.brand[1000] : primaryColors.gray[500]}
        strokeWidth={2}
        fill={isActive ? primaryColors.brand[1000] : primaryColors.gray[500]}
      />
      <Text
        style={{
          ...body.xs.medium,
          color: isActive ? primaryColors.brand[1000] : primaryColors.gray[500],
        }}
      >
        Menu
      </Text>
    </TouchableOpacity>
  );
};

export default MenuDrawer;

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

import { Platform, StyleSheet, Text, View } from "react-native";
import { SH, SW } from "../../../utils";
import { formElementsStyles } from "../../UI/Dropdown/formElementStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  getTabBarVisibility,
  handleMenuNavigation,
  ModulesData,
} from "../../../utils/ModulesData";
import CustomAddButton from "../../UI/GeneralComponents/CustomAddButton";
import { primaryColors } from "../../UI/DesignSystem/colorPalette";
import MenuDrawer from "./MenuDrawer";
import CustomTabBarButton from "./CustomTabBarButton";
import React, { useEffect } from "react";
import { setActiveSubButtonGlobal } from "../../../store/slices/activeSubButtonGlobal";
const CustomTabBar = ({
  setOpen,
  showTabBar,
  leftTabs,
  rightTabs,
  showMenuDrawer,
  showCustomAddButton,
  navigation,
  selectedProject,
  totalTabsRenderedOnScreen,
  menuModules,
}) => {
  console.log("Show tab bar in custom tab bar", showTabBar);
  return (
    <View
      style={{
        borderTopWidth: Platform.OS === "ios" ? 0 : SW(1),
        display: showTabBar ? "flex" : "none",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: SH(68),
        gap: SW(2),
        paddingVertical: SH(8),
        backgroundColor: "white",
        // position: "absolute",
        width: "100%",
        bottom: SH(0),
        borderColor: primaryColors.gray[200],
        ...formElementsStyles.minimalShadowUp,
      }}
    >
      {leftTabs.map((tab) => {
        return (
          <CustomTabBarButton
            tab={tab}
            key={tab.id}
            totalTabsRenderedOnScreen={totalTabsRenderedOnScreen}
            onPress={async () =>
              handleMenuNavigation(
                tab.componentName,
                navigation,
                selectedProject,
              )
            }
          />
        );
      })}
      {showCustomAddButton && <CustomAddButton />}
      {rightTabs.map((tab) => {
        return (
          <CustomTabBarButton
            tab={tab}
            key={tab.id}
            totalTabsRenderedOnScreen={totalTabsRenderedOnScreen}
            onPress={async () =>
              handleMenuNavigation(
                tab.componentName,
                navigation,
                selectedProject,
              )
            }
          />
        );
      })}
      {showMenuDrawer && (
        <MenuDrawer
          setOpen={setOpen}
          focused={false}
          menuModules={menuModules}
          totalTabsRenderedOnScreen={totalTabsRenderedOnScreen}
        />
      )}
    </View>
  );
};
export default React.memo(CustomTabBar);

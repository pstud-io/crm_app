import { borderRadius } from "@/design/borders";
import { center, xstack, ystack } from "@/design/layout";
import { heading } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeIcon from "assets/icons/HomeIcon";
import PlusIcon from "assets/icons/PlusIcon";
import { userNavigationRef } from "@/navigation/UserNavigation";
import { handleNavigation } from "@/utils/handleNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SearchOutline } from "@/svg";
import { StackActions } from "@react-navigation/native";
export const FloatingButtons = () => {
  const activeSubButtonGlobal = useSelector(
    (state: RootState) => state.activeSubButtonGlobal.activeSubButtonGlobal,
  );
  const isSheetOpen = useSelector(
    (state: RootState) => state.isSheetOpen.isSheetOpen,
  );
  const project = useSelector((state: RootState) => state.project);

  const { theme } = useTheme();

  const hideOn = [
    "add-task",
    "edit-task",
    "task-details",
    "signin",
    "note-details",
    "add-note",
    "profile",
    "notifications",
    "search",
    "auth",
  ];

  const disableOn = ["lead-info", "lead-stage", "dashboard"];

  const disable =
    activeSubButtonGlobal && disableOn.includes(activeSubButtonGlobal);

  if (activeSubButtonGlobal && hideOn.includes(activeSubButtonGlobal)) {
    return;
  }

  if (isSheetOpen) {
    console.log("Is sheetopen is", isSheetOpen);
    return;
  }

  return (
    <>
      <Pressable
        onPress={() => {
          if (activeSubButtonGlobal === "dashboard") return;
          userNavigationRef.reset({
            index: 0,
            routes: [
              {
                name: "Dashboard",
              },
            ],
          });
        }}
        style={[
          xstack,
          center,
          {
            width: 52,
            height: 52,
            borderRadius: borderRadius.full,
            position: "absolute",
            backgroundColor: theme.backgroundInverse,
            bottom: 16,
            left: 16,
            boxShadow: theme.shadow.lg,
          },
        ]}
      >
        <HomeIcon
          width={24}
          height={24}
          fill={theme.textInverse}
          stroke={theme.textInverse}
          strokeWidth={0}
        />
      </Pressable>

      <View
        style={[
          ystack,
          {
            position: "absolute",
            gap: 12,
            bottom: 16,
            right: 16,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Pressable
          style={[
            xstack,
            center,
            {
              width: 52,
              height: 52,
              borderRadius: borderRadius.full,
              backgroundColor: disable
                ? theme.backgroundDisabled
                : theme.backgroundInverse,

              boxShadow: theme.shadow.lg,
            },
          ]}
          disabled={disable}
          onPress={() => handleNavigation(activeSubButtonGlobal, project)}
        >
          <PlusIcon
            width={28}
            height={28}
            fill={theme.textInverse}
            stroke={theme.textInverse}
            strokeWidth={2}
          />
        </Pressable>
        <Pressable
          style={[
            xstack,
            center,
            {
              width: 52,
              height: 52,
              borderRadius: borderRadius.full,
              backgroundColor: theme.backgroundInverse,

              boxShadow: theme.shadow.lg,
            },
          ]}
          onPress={() =>
            userNavigationRef.dispatch(StackActions.push("Search"))
          }
        >
          <SearchOutline
            width={24}
            height={24}
            strokeWidth={2}
            stroke={theme.textInverse}
            fill="transparent"
            style={{}}
          />
        </Pressable>
      </View>
    </>
  );
};

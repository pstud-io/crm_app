import { borderRadius } from "@/design/borders";
import { center, xstack } from "@/design/layout";
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
export const FloatingButtons = () => {
  const activeSubButtonGlobal = useSelector(
    (state: RootState) => state.activeSubButtonGlobal.activeSubButtonGlobal,
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
  ];

  const disableOn = ["lead-info", "lead-stage"];

  const disable =
    activeSubButtonGlobal && disableOn.includes(activeSubButtonGlobal);

  if (activeSubButtonGlobal && hideOn.includes(activeSubButtonGlobal)) {
    return;
  }

  return (
    <>
      <Pressable
        onPress={() =>
          userNavigationRef.reset({
            index: 0,
            routes: [
              {
                name: "Dashboard",
              },
            ],
          })
        }
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

      <Pressable
        style={[
          xstack,
          center,
          {
            width: 52,
            height: 52,
            borderRadius: borderRadius.full,
            position: "absolute",
            backgroundColor: disable
              ? theme.backgroundDisabled
              : theme.backgroundInverse,
            bottom: 16,
            right: 16,
            boxShadow: theme.shadow.lg,
          },
        ]}
        disabled={disable}
        onPress={() => handleNavigation(activeSubButtonGlobal, project)}
      >
        <PlusIcon
          width={24}
          height={24}
          fill={theme.textInverse}
          stroke={theme.textInverse}
          strokeWidth={2}
        />
      </Pressable>
    </>
  );
};

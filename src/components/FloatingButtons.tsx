import { borderRadius } from "@/design/borders";
import { center, xstack } from "@/design/layout";
import { heading } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeIcon from "assets/icons/HomeIcon";
import PlusIcon from "assets/icons/PlusIcon";
import { userNavigationRef } from "@/navigation/UserNavigation";
export const FloatingButtons = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
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
            bottom: insets.bottom + 16,
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
            backgroundColor: theme.backgroundInverse,
            bottom: insets.bottom + 16,
            right: 16,
            boxShadow: theme.shadow.lg,
          },
        ]}
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

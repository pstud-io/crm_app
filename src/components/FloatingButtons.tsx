import { borderRadius } from "@/design/borders";
import { center, xstack } from "@/design/layout";
import { heading } from "@/design/typography";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserStackParamList } from "@/navigation/UserNavigation";
export const FloatingButtons = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  return (
    <>
      <Pressable
        onPress={() => console.log("This is the navigation passed", navigation)}
        style={[
          xstack,
          center,
          {
            width: 52,
            height: 52,
            borderRadius: borderRadius.full,
            position: "absolute",
            backgroundColor: "#fff000",
            bottom: insets.bottom + 16,
            left: 16,
          },
        ]}
      >
        <Text>*</Text>
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
          },
        ]}
      >
        <Text style={[heading.sm.extraLight, { color: theme.textInverse }]}>
          +
        </Text>
      </Pressable>
    </>
  );
};

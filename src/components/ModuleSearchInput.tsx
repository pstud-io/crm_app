import { Input, InputProps } from "react-native-elements";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { body } from "@/design/typography";
import { primaryColors } from "@/design/colors";
import SearchIcon from "assets/icons/SearchIcon";
import { height, width } from "@/design/distance";
import { borderRadius } from "@/design/borders";
import { spacing } from "@/design/spacing";

export interface SearchInputProps extends Omit<
  InputProps,
  | "leftIcon"
  | "containerStyle"
  | "inputContainerStyle"
  | "inputStyle"
  | "placeholderTextColor"
> {
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function ModuleSearchInput({
  containerStyle,
  inputContainerStyle,
  inputStyle,
  ...props
}: SearchInputProps) {
  const { theme } = useTheme();
  return (
    <Input
      renderErrorMessage={false}
      placeholderTextColor={theme.placeholderText}
      leftIconContainerStyle={{
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
        height: height[20],
      }}
      leftIcon={
        <SearchIcon
          width={width[16]}
          height={height[16]}
          strokeWidth={width[2]}
          fill={"transparent"}
          stroke={theme.placeholderText}
        />
      }
      inputStyle={[
        {
          color: theme.text,
          minHeight: height[20],
          maxHeight: height[20],
          ...body.sm.regular,
        },
        inputStyle,
      ]}
      containerStyle={[
        {
          paddingHorizontal: 0,
          height: height[40],
          flexGrow: 1,
          flexShrink: 1,
        },
        containerStyle,
      ]}
      inputContainerStyle={[
        {
          height: "100%",
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.lg,
          gap: spacing.min,
          backgroundColor: theme.header,
        },
        inputContainerStyle,
      ]}
      {...props}
    />
  );
}

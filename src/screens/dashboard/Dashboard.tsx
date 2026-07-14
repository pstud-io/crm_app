import { ItemSeparator } from "@/components/ItemSeperator";
import { MenuItem } from "@/components/MenuItem";
import {
  center,
  fullHeight,
  fullWidth,
  topCenter,
  xstack,
  ystack,
} from "@/design/layout";
import { spacing } from "@/design/spacing";
import { body } from "@/design/typography";
import { useAuth } from "@/hooks/useAuth";
import { useModulesData } from "@/hooks/useModulesData";
import { useTheme } from "@/hooks/useTheme";
import { Role } from "@/types/AuthTypes";
import { StatusBar } from "expo-status-bar";
import { View, Text, Button, ScrollView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  UserNavigationProp,
  UserStackParamsList,
} from "@/navigation/UserNavigation";
export const Dashboard = () => {
  const { isDark, theme } = useTheme();
  const navigation = useNavigation<UserNavigationProp>();
  const { pipelineData, actionsData } = useModulesData(navigation);
  return (
    <ScrollView
      style={[
        ystack,
        fullWidth,
        fullHeight,
        {
          gap: spacing.lg,
        },
      ]}
      contentContainerStyle={[
        topCenter,
        {
          gap: spacing.lg,
          paddingTop: spacing.max,
          paddingBottom: spacing.extreme,
        },
      ]}
    >
      <View style={[ystack, topCenter, fullWidth]}>
        <Text
          style={[
            fullWidth,
            body.md.semiBold,
            {
              color: theme.text,
              paddingHorizontal: spacing.lg,
              gap: spacing.lg,
            },
          ]}
        >
          Pipeline
        </Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={pipelineData}
          scrollEnabled={false}
          style={[fullWidth, { paddingHorizontal: spacing.lg }]}
          contentContainerStyle={{ paddingVertical: spacing.lg }}
          renderItem={({ item }) => {
            return (
              <MenuItem
                label={item.label}
                leftIcon={item.icon}
                hasRightIcon={true}
                onPress={item.onPress}
                leftIconTheme={{ background: "#000000", text: "#ffffff" }}
                labelColor={theme.text}
                rightIcon={null}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={
            <ItemSeparator direction="horizontal" opacity={0} />
          }
        />
      </View>
      <View style={[ystack, topCenter, fullWidth]}>
        <Text
          style={[
            fullWidth,
            body.md.semiBold,
            {
              color: theme.text,
              paddingHorizontal: spacing.lg,
              gap: spacing.lg,
            },
          ]}
        >
          Actions
        </Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={actionsData}
          scrollEnabled={false}
          style={[fullWidth, { paddingHorizontal: spacing.lg }]}
          contentContainerStyle={{ paddingVertical: spacing.lg }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <MenuItem
                label={item.label}
                leftIcon={item.icon}
                hasRightIcon={true}
                onPress={item.onPress}
                leftIconTheme={{ background: "#000000", text: "#ffffff" }}
                labelColor={theme.text}
                rightIcon={null}
              />
            );
          }}
          ItemSeparatorComponent={
            <ItemSeparator direction="horizontal" opacity={0} />
          }
        />
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ScrollView>
  );
};

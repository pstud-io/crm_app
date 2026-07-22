import React, { forwardRef } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { spacing } from "@/design/spacing";
import { ItemSeparator } from "./ItemSeperator";
import { fullHeight, fullWidth } from "@/design/layout";
import { body } from "@/design/typography";

export type CustomFlatListProps<T> = FlatListProps<T> & {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

function CustomFlatListComponent<T>(
  props: CustomFlatListProps<T>,
  ref: React.ForwardedRef<FlatList<T>>,
) {
  const { theme } = useTheme();
  const { loading, refreshing, onRefresh, ...flatListProps } = props;

  return (
    <FlatList
      {...flatListProps}
      ref={ref}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      horizontal={true}
      style={[
        fullWidth,
        {
          backgroundColor: theme.background,
          // maxWidth: "100%",
        },
      ]}
      contentContainerStyle={[
        {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
        },
        props.contentContainerStyle,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.backgroundInverse}
          colors={[theme.backgroundInverse]}
          progressBackgroundColor={theme.header}
        />
      }
      ListEmptyComponent={
        <Text
          style={[
            body.sm.regular,
            {
              textAlign: "center",
              color: theme.textSecondary,
            },
          ]}
        >
          No Data Available
        </Text>
      }
      ItemSeparatorComponent={() => (
        <ItemSeparator direction="vertical" opacity={0} />
      )}
      ListFooterComponent={
        loading ? (
          <View
            style={{
              paddingHorizontal: 8,
              paddingBottom: 8,
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingIndicatorFooter width="100%" size={10} />
          </View>
        ) : (
          (props.ListFooterComponent ?? null)
        )
      }
    />
  );
}

export const CustomHorizontalList = forwardRef(CustomFlatListComponent) as <T>(
  props: CustomFlatListProps<T> & {
    ref?: React.ForwardedRef<FlatList<T>>;
  },
) => React.ReactElement;

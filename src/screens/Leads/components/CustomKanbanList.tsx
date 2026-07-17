import React, { forwardRef } from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/design/spacing";
import { center, fullHeight, fullWidth } from "@/design/layout";
import { body } from "@/design/typography";
import { ItemSeparator } from "@/components/ItemSeperator";
import LoadingIndicatorFooter from "@/components/LoadingIndicatorFooter";

export type CustomKanbanListProps<T> = FlatListProps<T> & {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

export function CustomKanbanListComponent<T>(
  props: CustomKanbanListProps<T>,
  ref: React.ForwardedRef<FlatList<T>>,
) {
  const { theme } = useTheme();
  const { loading, refreshing, onRefresh, ...flatListProps } = props;

  return (
    <FlatList
      {...flatListProps}
      ref={ref}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      style={[fullWidth, fullHeight]}
      contentContainerStyle={[
        {
          padding: spacing.lg,
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
        <ItemSeparator
          direction="vertical"
          opacity={0}
          style={{ marginHorizontal: spacing.sm }}
        />
      )}
      ListFooterComponent={
        loading ? (
          <View
            style={[
              center,
              fullHeight,
              {
                paddingHorizontal: spacing.xxl,
              },
            ]}
          >
            <LoadingIndicatorFooter width="100%" size={16} />
          </View>
        ) : (
          (props.ListFooterComponent ?? null)
        )
      }
    />
  );
}

export const CustomKanbanList = forwardRef(CustomKanbanListComponent) as <T>(
  props: CustomKanbanListProps<T> & {
    ref?: React.ForwardedRef<FlatList<T>>;
  },
) => React.ReactElement;

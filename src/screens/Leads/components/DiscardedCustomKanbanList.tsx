import React, { forwardRef } from "react";
import { RefreshControl, Text, View } from "react-native";
import {
  LegendList,
  LegendListProps,
  LegendListRef,
} from "@legendapp/list/react-native";

import { useTheme } from "@/hooks/useTheme";
import { spacing } from "@/design/spacing";
import { center, fullHeight, fullWidth, xstack } from "@/design/layout";
import { body } from "@/design/typography";
import { ItemSeparator } from "@/components/ItemSeperator";
import LoadingIndicatorFooter from "@/components/LoadingIndicatorFooter";

export type CustomKanbanListProps<T> = LegendListProps<T> & {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

export function CustomKanbanListComponent<T>(
  props: CustomKanbanListProps<T>,
  ref: React.ForwardedRef<LegendListRef>,
) {
  const { theme } = useTheme();
  const { loading, refreshing, onRefresh, ...legendListProps } = props;

  return (
    <LegendList
      {...legendListProps}
      ref={ref}
      horizontal
      recycleItems
      estimatedItemSize={100}
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      style={[fullWidth, fullHeight, { backgroundColor: "#000fff" }]}
      contentContainerStyle={[
        xstack,
        {
          padding: spacing.lg,
          backgroundColor: "#fff000",
          height: "100%",
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
          style={{ marginHorizontal: spacing.xs }}
        />
      )}
      onEndReachedThreshold={0.1}
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
    ref?: React.ForwardedRef<LegendListRef>;
  },
) => React.ReactElement;

import React, { forwardRef } from "react";
import { RefreshControl, Text } from "react-native";
import {
  LegendList,
  LegendListProps,
  LegendListRef,
} from "@legendapp/list/react-native";

import { useTheme } from "@/hooks/useTheme";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { spacing } from "@/design/spacing";
import { ItemSeparator } from "./ItemSeperator";
import { fullHeight, fullWidth } from "@/design/layout";
import { body } from "@/design/typography";

export type CustomLegendListProps<T> = LegendListProps<T> & {
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
};

export function CustomLegendListComponent<T>(
  props: CustomLegendListProps<T>,
  ref: React.ForwardedRef<LegendListRef>,
) {
  const { theme } = useTheme();
  const { loading, refreshing, onRefresh, ...legendListProps } = props;

  return (
    <LegendList
      {...legendListProps}
      ref={ref}
      recycleItems
      estimatedItemSize={100}
      showsVerticalScrollIndicator={false}
      style={[
        fullWidth,
        fullHeight,
        {
          backgroundColor: theme.background,
          maxWidth: "100%",
        },
      ]}
      contentContainerStyle={[
        {
          paddingHorizontal: spacing.lg,
          width: "100%",
          paddingTop: spacing.lg,
          paddingBottom: 5 * spacing.max,
        },
        props.contentContainerStyle,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={async () => await props.onRefresh()}
          tintColor={theme.backgroundInverse}
          colors={[theme.backgroundInverse]}
          progressBackgroundColor={theme.header}
        />
      }
      ListEmptyComponent={
        <Text
          style={[
            body.sm.regular,
            { textAlign: "center", color: theme.textSecondary },
          ]}
        >
          No Data Available
        </Text>
      }
      ItemSeparatorComponent={() => (
        <ItemSeparator direction="horizontal" opacity={0} />
      )}
      ListFooterComponent={
        props.loading ? (
          <LoadingIndicatorFooter width="100%" size={10} />
        ) : props.ListFooterComponent ? (
          props.ListFooterComponent
        ) : null
      }
    />
  );
}

export const CustomLegendList = forwardRef(CustomLegendListComponent) as <T>(
  props: CustomLegendListProps<T> & {
    ref?: React.ForwardedRef<LegendListRef>;
  },
) => React.ReactElement;

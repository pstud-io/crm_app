import React, { forwardRef } from "react";
import {
  RefreshControl,
  SectionList,
  SectionListProps,
  SectionListData,
  Text,
} from "react-native";

import { useTheme } from "@/hooks/useTheme";
import LoadingIndicatorFooter from "./LoadingIndicatorFooter";
import { ItemSeparator } from "./ItemSeperator";
import { spacing } from "@/design/spacing";
import { fullHeight, fullWidth } from "@/design/layout";
import { body } from "@/design/typography";

export interface CustomSection<T> extends SectionListData<T> {
  title: string;
}

export type CustomSectionListProps<T> = Omit<
  SectionListProps<T, CustomSection<T>>,
  "sections"
> & {
  sections: CustomSection<T>[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void> | void;
};

export function CustomSectionListComponent<T>(
  props: CustomSectionListProps<T>,
  ref: React.ForwardedRef<SectionList<T, CustomSection<T>>>,
) {
  const { theme } = useTheme();

  const { loading, refreshing, onRefresh, ...sectionProps } = props;

  return (
    <SectionList
      {...sectionProps}
      ref={ref}
      stickySectionHeadersEnabled
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
          paddingTop: spacing.lg,
          paddingBottom: spacing.max * 5,
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
          size="large"
        />
      }
      ItemSeparatorComponent={() => (
        <ItemSeparator direction="horizontal" opacity={0} />
      )}
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
      ListFooterComponent={
        loading ? (
          <LoadingIndicatorFooter width="100%" size={10} />
        ) : props.ListFooterComponent ? (
          props.ListFooterComponent
        ) : null
      }
    />
  );
}

export const CustomSectionList = forwardRef(CustomSectionListComponent) as <T>(
  props: CustomSectionListProps<T> & {
    ref?: React.ForwardedRef<SectionList<T, CustomSection<T>>>;
  },
) => React.ReactElement;

import Popover from "react-native-popover-view";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { spacing } from "@/design/spacing";
import { height, width } from "@/design/distance";
import { borderRadius, borderWidth } from "@/design/borders";
import FilterIcon from "assets/icons/FilterIcon";
import { body } from "@/design/typography";
import CloseOutlineIcon from "assets/icons/CloseIcon";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/design/layout";
import { useTheme } from "@/hooks/useTheme";
import { Placement } from "react-native-popover-view/dist/Types";
import { primaryColors } from "@/design/colors";

export interface FilterSubSection {
  id: string;
  value: string;
}

export interface FilterMethod {
  id: string;
  value: string;
  subSections: FilterSubSection[];
}

export interface SortMethod {
  id: string;
  value: string;
}

export type FilterState = Record<string, string[]>;
export type SortState = string | null;

export enum FilterSortEnum {
  FILTER = "Filter",
  SORT = "Sort",
}

export interface FilterSortPopoverProps {
  id: string | number;
  title: string;
  filterMethods: FilterMethod[];
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  initialFilterState: FilterState;
  sortMethods: SortMethod[];
  sortState: SortState;
  setSortState: Dispatch<SetStateAction<SortState>>;
  initialSortState: SortState;
}

export const FilterSortPopover = ({
  id,
  title,
  filterMethods,
  filterState,
  setFilterState,
  initialFilterState,
  sortMethods,
  sortState,
  setSortState,
  initialSortState,
}: FilterSortPopoverProps) => {
  const { theme } = useTheme();
  const filterSortPopoverRef = useRef<Popover | null>(null);
  const [filterCount, setFilterCount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<FilterSortEnum>(
    FilterSortEnum.FILTER,
  );
  const [selectedSection, setSelectedSection] = useState<string>(
    filterMethods[0].id,
  );
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    ...filterState,
  });
  const [selectedSort, setSelectedSort] = useState<SortState>(sortState);

  useEffect(() => {
    const totalCount: number = Object.values(filterState).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    setFilterCount(totalCount);
    setSelectedFilters({ ...filterState });
  }, [filterState]);

  useEffect(() => {
    setSelectedSort(sortState);
  }, [sortState]);

  useEffect(() => {
    console.log("Selected Filters changed", selectedFilters);
  }, [selectedFilters]);

  useEffect(() => {
    console.log("Selected sort changed", selectedSort);
  }, [selectedSort]);

  const toggleSelection = (id: string) => {
    const currentSelectedFilters = selectedFilters[selectedSection] || [];
    if (currentSelectedFilters.includes(id)) {
      setSelectedFilters((prev) => {
        return {
          ...prev,
          [selectedSection]: currentSelectedFilters.filter(
            (item) => item !== id,
          ),
        };
      });
    } else {
      setSelectedFilters((prev) => {
        return {
          ...prev,
          [selectedSection]: [...currentSelectedFilters, id],
        };
      });
    }
  };

  const renderOptions = () => {
    if (activeTab === "Filter") {
      const options = filterMethods.find(
        (methods) => methods.id === selectedSection,
      )?.subSections;
      // console.log("Options are", options);

      return options?.map((option) => (
        <BouncyCheckbox
          key={option.id}
          size={16}
          fillColor={theme.backgroundInverse}
          unFillColor={theme.header}
          text={option.value}
          iconStyle={{
            borderColor: theme.border,
            borderRadius: borderRadius.tiny,
          }}
          textContainerStyle={{ marginLeft: spacing.xs }}
          innerIconStyle={{ borderRadius: borderRadius.tiny }}
          textStyle={{
            textDecorationLine: "none",
            ...body.md.regular,
            color: theme.text,
          }}
          isChecked={selectedFilters[selectedSection]?.includes(option?.id)}
          onPress={() => toggleSelection(option.id)}
          style={{
            marginBottom: spacing.xl,
          }}
        />
      ));
    } else if (activeTab === "Sort") {
      return sortMethods.map((option) => (
        <BouncyCheckbox
          key={option.id}
          size={16}
          fillColor={theme.backgroundInverse}
          unFillColor={theme.header}
          text={option.value}
          textContainerStyle={{ marginLeft: spacing.xs }}
          iconStyle={{
            borderColor: theme.border,
            borderRadius: borderRadius.sm, // for circular radio look
          }}
          innerIconStyle={{
            borderRadius: borderRadius.sm,
          }}
          textStyle={{
            textDecorationLine: "none",
            ...body.md.regular,
            color: theme.text,
          }}
          isChecked={selectedSort === option.id}
          onPress={() => setSelectedSort(option.id)}
          style={{ marginBottom: spacing.xl }}
        />
      ));
    }
  };

  return (
    <Popover
      key={id}
      ref={filterSortPopoverRef}
      from={
        <TouchableOpacity activeOpacity={0.7} style={styles.trigger}>
          {(filterCount ?? 0) > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filterCount}</Text>
            </View>
          )}
          <FilterIcon
            width={width[20]}
            height={height[20]}
            stroke={theme.placeholderText}
            strokeWidth={2}
          />
        </TouchableOpacity>
      }
      placement={Placement.CENTER}
      popoverStyle={{
        borderRadius: borderRadius.lg,
        height: SCREEN_HEIGHT * 0.7,
        width: SCREEN_WIDTH * 0.9,
      }}
      onCloseComplete={() => {
        setSelectedSection(filterMethods[0].id);
        setActiveTab(FilterSortEnum.FILTER);
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
            borderBottomWidth: 1,
            borderColor: "#ddd",
            paddingVertical: spacing.lg,
          }}
        >
          <Text
            style={{
              ...body.md.medium,
              color: theme.text,
              marginTop: spacing.tiny,
            }}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedFilters({ ...filterState });
              setSelectedSort(sortState);
              filterSortPopoverRef.current?.requestClose();
            }}
          >
            <CloseOutlineIcon
              width={width[16]}
              height={height[16]}
              fill={theme.header}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar}>
          {[FilterSortEnum.FILTER, FilterSortEnum.SORT].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
              }}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
                { borderColor: theme.backgroundInverse },
              ]}
            >
              <Text style={[styles.tabText, { color: theme.text }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          <View style={styles.leftPanel}>
            {activeTab === "Filter" &&
              filterMethods.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  onPress={() => setSelectedSection(section.id)}
                  style={[
                    styles.sectionButton,
                    selectedSection === section.id &&
                      styles.activeSectionButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionText,
                      selectedSection === section.id &&
                        styles.activeSectionText,
                    ]}
                  >
                    {section.value}
                  </Text>
                </TouchableOpacity>
              ))}
            {activeTab === "Sort" && (
              <View
                key={"sort-section"}
                style={[styles.sectionButton, styles.activeSectionButton]}
              >
                <Text style={[styles.sectionText, styles.activeSectionText]}>
                  Sort By
                </Text>
              </View>
            )}
          </View>

          <View style={styles.rightPanel}>{renderOptions()}</View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: spacing.xs,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderTopWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              console.log("Setting selecteSort to", initialSortState);
              setSelectedFilters({ ...initialFilterState });
              setSelectedSort(initialSortState);
            }}
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.backgroundInverse,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.xxl,
              backgroundColor: theme.background,
              borderRadius: borderRadius.xxl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.md.regular,
                color: theme.text,
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilterState({ ...selectedFilters });
              setSortState(selectedSort);
              filterSortPopoverRef.current?.requestClose();
            }}
            style={{
              backgroundColor: theme.backgroundInverse,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.xxl,
              borderRadius: borderRadius.xxl,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.md.regular,
                color: theme.textInverse,
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    alignSelf: "center",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: borderWidth.md,
    borderColor: "#ddd",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: borderWidth.thick,
  },
  tabText: {
    ...body.md.regular,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: "50%",
    borderRightWidth: borderWidth.md,
    borderColor: "#eee",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rightPanel: {
    width: "50%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  activeSectionButton: {
    backgroundColor: primaryColors.gray[200],
  },
  sectionText: {
    ...body.sm.regular,
    color: primaryColors.gray[900],
  },
  activeSectionText: {
    ...body.sm.medium,
    color: primaryColors.gray[900],
  },
  trigger: {
    padding: spacing.tiny,
    display: "flex",
    height: height[40],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.xs,
    borderWidth: borderWidth.md,
    borderColor: primaryColors.gray[200],
    width: width[40],
    elevation: 1,
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: "white",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -4,
    backgroundColor: primaryColors.gray[900],
    minWidth: 16,
    height: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingHorizontal: 2,
  },
  badgeText: {
    ...body.xxs.medium,
    color: primaryColors.gray[25],
    includeFontPadding: false,
  },
});

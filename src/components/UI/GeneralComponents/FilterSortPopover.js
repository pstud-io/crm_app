import Popover from "react-native-popover-view";
import FilterOutline from "../../../svg/filter-outline";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors, SH, SW, SF } from "../../../utils";
import { useRef, useState, useEffect } from "react";
import { primaryColors } from "../DesignSystem/colorPalette";
import { CloseOutlineIcon } from "../../../svg";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { body } from "../DesignSystem/typography";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../utils";
import FilterLine from "../../../svg/filter-line";
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
}) => {
  const filterSortPopoverRef = useRef(null);
  const [filterCount, setFilterCount] = useState(null);
  const [activeTab, setActiveTab] = useState("Filter");
  const [selectedSection, setSelectedSection] = useState(filterMethods[0].id);
  const [selectedFilters, setSelectedFilters] = useState({ ...filterState });
  const [selectedSort, setSelectedSort] = useState(sortState);

  useEffect(() => {
    const totalCount = Object.values(filterState).reduce(
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

  const toggleSelection = (id) => {
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
      ).subSections;
      // console.log("Options are", options);

      return options.map((option) => (
        <BouncyCheckbox
          key={option.id}
          size={16}
          fillColor={primaryColors.brand[1000]}
          unfillColor="#FFFFFF"
          text={option.value}
          iconStyle={{
            borderColor: primaryColors.brand[1000],
            borderRadius: 4,
          }}
          textContainerStyle={{ marginLeft: SW(8) }}
          innerIconStyle={{ borderRadius: 4 }}
          textStyle={{
            textDecorationLine: "none",
            ...body.md.regular,
            color: primaryColors.gray[900],
          }}
          isChecked={selectedFilters[selectedSection]?.includes(option?.id)}
          onPress={() => toggleSelection(option.id)}
          style={{
            marginBottom: SH(20),
          }}
        />
      ));
    } else if (activeTab === "Sort") {
      return sortMethods.map((option) => (
        <BouncyCheckbox
          key={option.id}
          size={16}
          fillColor={primaryColors.brand[1000]}
          unfillColor="#FFFFFF"
          text={option.value}
          textContainerStyle={{ marginLeft: SW(8) }}
          iconStyle={{
            borderColor: primaryColors.brand[1000],
            borderRadius: 10, // for circular radio look
          }}
          innerIconStyle={{
            borderRadius: 10,
          }}
          textStyle={{
            textDecorationLine: "none",
            ...body.md.regular,
            color: primaryColors.gray[900],
          }}
          isChecked={selectedSort === option.id}
          disableBuiltInState
          onPress={() => setSelectedSort(option.id)}
          style={{ marginBottom: SH(20) }}
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
          {filterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filterCount}</Text>
            </View>
          )}
          <FilterLine
            width={SW(20)}
            height={SH(20)}
            stroke={primaryColors.gray[700]}
            strokeWidth={2}
          />
        </TouchableOpacity>
      }
      placement={"center"}
      popoverStyle={{
        borderRadius: SW(16),
        height: SCREEN_HEIGHT * 0.7,
        width: SCREEN_WIDTH * 0.9,
      }}
      onCloseComplete={() => {
        setSelectedSection(filterMethods[0].id);
        setActiveTab("Filter");
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: SW(16),
            borderBottomWidth: 1,
            borderColor: "#ddd",
            paddingVertical: SH(16),
          }}
        >
          <Text
            style={{
              ...body.md.medium,
              color: primaryColors.gray[900],
              marginTop: SH(3.5),
            }}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedFilters({ ...filterState });
              setSelectedSort(sortState);
              filterSortPopoverRef.current.requestClose();
            }}
          >
            <CloseOutlineIcon
              width={SW(16)}
              height={SH(16)}
              fill={primaryColors.gray[500]}
            />
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <View style={styles.tabBar}>
          {["Filter", "Sort"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                setActiveTab(tab);
              }}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Left panel: sections */}
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

          {/* Right panel: options */}
          <View style={styles.rightPanel}>{renderOptions()}</View>
        </View>
        {/* Bottom Buttons */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: SW(8),
            paddingVertical: SW(16),
            paddingHorizontal: SW(16),
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
              borderColor: primaryColors.button.active,
              paddingVertical: SH(8),
              paddingHorizontal: SH(24),
              backgroundColor: "#fff",
              borderRadius: SW(24),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.md.regular,
                color: primaryColors.button.active,
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setFilterState({ ...selectedFilters });
              setSortState(selectedSort);
              filterSortPopoverRef.current.requestClose();
            }}
            style={{
              backgroundColor: primaryColors.button.active,
              paddingVertical: SH(8),
              paddingHorizontal: SH(24),
              borderRadius: SW(24),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...body.md.regular,
                color: primaryColors.gray[25],
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
    borderBottomWidth: SW(1),
    borderColor: "#ddd",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: SH(12),
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: SH(2),
    borderColor: primaryColors.brand[1000],
  },
  tabText: {
    ...body.md.regular,
    color: primaryColors.gray[900],
  },
  activeTabText: {
    ...body.md.semiBold,
    color: primaryColors.gray[900],
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: "50%",
    borderRightWidth: SW(1),
    borderColor: "#eee",
    paddingVertical: SH(12),
    paddingHorizontal: SW(16),
  },
  rightPanel: {
    width: "50%",
    paddingHorizontal: SW(16),
    paddingVertical: SH(20),
  },
  sectionButton: {
    paddingVertical: SH(12),
    paddingHorizontal: SW(12),
    borderRadius: SW(10),
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
    padding: SW(4),
    display: "flex",
    height: SH(40),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SW(8),
    borderWidth: SW(1),
    borderColor: primaryColors.gray[200],
    width: SH(40),
    elevation: 1,
    shadowColor: "#0A0D12",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    backgroundColor: "white",
  },
  badge: {
    position: "absolute",
    top: -SH(6),
    right: -SW(4),
    backgroundColor: primaryColors.brand[1000],
    minWidth: SH(16),
    height: SH(16),
    borderRadius: SW(10),
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

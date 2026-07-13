import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../../UI/DesignSystem/typography";
import { primaryColors } from "../../../UI/DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import { CloseOutlineIcon, SearchOutline, Checkbox } from "../../../../svg";
import { usePRendpoints } from "../../../../screens/PurchaseRequest/hooks/usePRendpoints";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MaterialMultiSelectPopup = ({
  visible,
  onClose,
  data,
  selectedIds,
  onConfirm,
  loading,
  page,
  hasMore,
  setLoading,
  setMaterialsData,
  setHasMore,
  setPage,
  searchTerm,
  handleSearchChange,
}) => {
  const [tempSelectedIds, setTempSelectedIds] = useState([]);

  const { getMaterialsForDropdown } = usePRendpoints();
  useEffect(() => {
    if (visible) {
      setTempSelectedIds(selectedIds || []);
    }
  }, [visible, selectedIds]);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelection = (id) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDone = () => {
    onConfirm(tempSelectedIds);
    onClose();
  };

  return (
    <Popover
      isVisible={visible}
      onRequestClose={onClose}
      animationConfig={{ duration: 250, useNativeDriver: true }}
      backgroundStyle={styles.backdrop}
      popoverStyle={styles.popoverContainer}
    >
      <View style={styles.innerContent}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Select Materials</Text>
          <TouchableOpacity onPress={onClose}>
            <CloseOutlineIcon
              fill={primaryColors.gray[400]}
              width={SW(18)}
              height={SH(18)}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchOutline
              stroke={primaryColors.gray[400]}
              width={SW(18)}
              height={SH(18)}
            />
            <TextInput
              placeholder="Search materials..."
              placeholderTextColor={primaryColors.gray[400]}
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={handleSearchChange}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              const isSelected = tempSelectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  style={[styles.itemRow, isSelected && styles.selectedItemRow]}
                  onPress={() => toggleSelection(item.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.itemTextContent}>
                    <Text
                      style={[
                        styles.itemName,
                        isSelected && styles.selectedItemName,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <Checkbox
                    isSelected={isSelected}
                    onPress={() => toggleSelection(item.id)}
                  />
                </TouchableOpacity>
              );
            }}
            onEndReached={async () => {
              console.log("Loading and hasMore", loading, hasMore);
              if (!loading && hasMore) {
                const nextPage = page + 1;

                const res = await getMaterialsForDropdown(
                  loading,
                  setLoading,
                  setMaterialsData,
                  nextPage,
                  hasMore,
                  searchTerm,
                );

                setPage(nextPage);
                setHasMore(res?.hasMore);
              }
            }}
            ListFooterComponent={
              loading && (
                <View style={styles.centerContainer}>
                  <ActivityIndicator
                    size="small"
                    color={primaryColors.brand[1000]}
                  />
                  <Spacing space={SH(12)} />
                  <Text style={styles.loadingText}>{""}</Text>
                </View>
              )
            }
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.noDataText}>No materials found</Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <BottomButton
            title="Cancel"
            onPress={onClose}
            type="outlined"
            style={styles.flexButton}
          />
          <BottomButton
            title={`Done (${tempSelectedIds.length})`}
            onPress={handleDone}
            type="default"
            style={styles.flexButton}
            // disabled={loading}
          />
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: {
    width: "100%",
    flexShrink: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(16),
    backgroundColor: primaryColors.gray[25],
    borderBottomWidth: 1,
    borderBottomColor: primaryColors.gray[100],
  },
  headerTitle: {
    ...body.md.bold,
    color: primaryColors.gray[900],
  },
  searchContainer: {
    paddingHorizontal: SW(16),
    paddingTop: SH(16),
    paddingBottom: SH(8),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primaryColors.gray[50],
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    borderRadius: SW(8),
    paddingHorizontal: SW(12),
    height: SH(40),
  },
  searchInput: {
    flex: 1,
    marginLeft: SW(8),
    ...body.sm.regular,
    color: primaryColors.gray[900],
  },
  listContainer: {
    height: SH(300),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...body.xs.medium,
    color: primaryColors.gray[500],
  },
  noDataText: {
    ...body.sm.regular,
    color: primaryColors.gray[400],
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(14),
  },
  selectedItemRow: {
    backgroundColor: primaryColors.gray[100],
  },
  itemName: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
  },
  selectedItemName: {
    color: primaryColors.brand[1000],
  },
  separator: {
    height: 1,
    backgroundColor: primaryColors.gray[100],
    marginHorizontal: SW(20),
  },
  footer: {
    flexDirection: "row",
    gap: SW(12),
    padding: SW(20),
    borderTopWidth: 1,
    borderTopColor: primaryColors.gray[100],
  },
  flexButton: {
    flex: 1,
  },
});

export default MaterialMultiSelectPopup;

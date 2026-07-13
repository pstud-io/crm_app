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
  I18nManager,
  Platform,
  Modal,
  Pressable,
  Keyboard,
} from "react-native";
import Popover, { Rect } from "react-native-popover-view";
import { SW, SH } from "../../../../utils";
import { body } from "../../../UI/DesignSystem/typography";
import { primaryColors } from "../../../UI/DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import { CloseOutlineIcon, SearchOutline, Checkbox } from "../../../../svg";
import useKeyboardStatus from "../../../../hooks/useKeyboardStatus";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SelectionPopover = ({
  visible = false,
  onClose,
  data,
  selectedIds,
  onConfirm,
  loading,
  title,
  isMultiSelect = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState([]);
  const isKeyboardVisible = useKeyboardStatus();

  const centerRect = new Rect(
    SCREEN_WIDTH / 2 - 1,
    SCREEN_HEIGHT / 2 - 1,
    2,
    2,
  );

  useEffect(() => {
    if (visible) {
      const initialSelection = Array.isArray(selectedIds)
        ? selectedIds
        : selectedIds
          ? [selectedIds]
          : [];
      setTempSelected(initialSelection);
      setSearchQuery("");
    }
  }, [visible, selectedIds]);

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        (item.name || item.project_name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleSelection = (id) => {
    if (isMultiSelect) {
      setTempSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    } else {
      // Single select: confirm and close immediately
      onConfirm(id);
      onClose();
    }
  };

  const handleDone = () => {
    onConfirm(tempSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose()}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        {/* <View style={styles.modalBackdrop}> */}
        <View
          style={[
            styles.popoverContainer,
            {
              width: isMultiSelect ? SCREEN_WIDTH * 0.85 : SCREEN_WIDTH * 0.8,
            },
          ]}
        >
          <View style={styles.innerContent}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}> {title} </Text>
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
                  placeholder={" Search... "}
                  placeholderTextColor={primaryColors.gray[400]}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.listContainer}>
              {loading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator
                    size="large"
                    color={primaryColors.brand[1000]}
                  />
                  <Spacing space={SH(10)} />
                  <Text style={styles.loadingText}>
                    {" "}
                    {" Fetching data... "}{" "}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps={"handled"}
                  renderItem={({ item }) => {
                    const isSelected = tempSelected.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.itemRow,
                          isSelected && styles.selectedItemRow,
                        ]}
                        onPress={() => handleSelection(item.id)}
                        activeOpacity={0.9}
                      >
                        <Text
                          style={[
                            styles.itemName,
                            isSelected && styles.selectedItemName,
                          ]}
                        >
                          {item.name || item.project_name}
                        </Text>
                        {/* Hide checkbox for single select */}
                        {isMultiSelect && (
                          <Checkbox
                            isSelected={isSelected}
                            onPress={() => handleSelection(item.id)}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  ListEmptyComponent={
                    <View style={styles.centerContainer}>
                      <Text style={styles.noDataText}>
                        {" "}
                        {" No results found "}{" "}
                      </Text>
                    </View>
                  }
                />
              )}
            </View>

            {/* Show footer only for multi-select mode */}
            {isMultiSelect && (
              <View style={styles.footer}>
                <BottomButton
                  title={`Cancel`}
                  onPress={onClose}
                  type="outlined"
                  style={styles.flexButton}
                />
                <BottomButton
                  title={
                    tempSelected.length > 0
                      ? `Done (${tempSelected.length})`
                      : ` ${"Done"} `
                  }
                  onPress={handleDone}
                  type="default"
                  style={styles.flexButton}
                  disabled={loading}
                />
              </View>
            )}
          </View>
        </View>
        {/* </View> */}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popoverContainer: {
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: { width: "100%", flexShrink: 1 },
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
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
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
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  listContainer: { height: SCREEN_HEIGHT * 0.35 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SH(40),
  },
  loadingText: {
    ...body.xs.medium,
    color: primaryColors.gray[500],
    includeFontPadding: false,
  },
  noDataText: {
    ...body.sm.regular,
    color: primaryColors.gray[400],
    includeFontPadding: false,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(14),
  },
  selectedItemRow: { backgroundColor: primaryColors.gray[100] },
  itemName: {
    ...body.sm.medium,
    color: primaryColors.gray[700],
    includeFontPadding: false,
    textAlign: I18nManager.isRTL ? "right" : "left",
    flex: 1,
  },
  selectedItemName: { color: primaryColors.brand[1000] },
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
    backgroundColor: "#fff",
  },
  flexButton: { flex: 1 },
  backdrop: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectionPopover;

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
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import { CloseOutlineIcon, SearchOutline, Checkbox } from "../../../../svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const UOMSelectPopup = ({
  visible,
  onClose,
  data,
  selectedId,
  onConfirm,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState(null);

  useEffect(() => {
    if (visible) {
      setTempSelectedId(selectedId);
      setSearchQuery("");
    }
  }, [visible, selectedId]);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (id) => {
    setTempSelectedId(id);
  };

  const handleDone = () => {
    onConfirm(tempSelectedId);
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
          <Text style={styles.headerTitle}>Select UOM</Text>
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
              placeholder="Search UOM..."
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
              <Text style={styles.loadingText}>Fetching UOMs...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => {
                const isSelected = tempSelectedId === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.itemRow,
                      isSelected && styles.selectedItemRow,
                    ]}
                    onPress={() => handleSelect(item.id)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[
                        styles.itemName,
                        isSelected && styles.selectedItemName,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Checkbox
                      isSelected={isSelected}
                      onPress={() => handleSelect(item.id)}
                    />
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.centerContainer}>
                  <Text style={styles.noDataText}>No UOM found</Text>
                </View>
              }
            />
          )}
        </View>

        <View style={styles.footer}>
          <BottomButton
            title="Cancel"
            onPress={onClose}
            type="outlined"
            style={styles.flexButton}
          />
          <BottomButton
            title="Done"
            onPress={handleDone}
            type="default"
            style={styles.flexButton}
            disabled={loading}
          />
        </View>
      </View>
    </Popover>
  );
};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
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
  headerTitle: { ...body.md.bold, color: primaryColors.gray[900] },
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
  listContainer: { height: SH(300) },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { ...body.xs.medium, color: primaryColors.gray[500] },
  noDataText: { ...body.sm.regular, color: primaryColors.gray[400] },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SW(20),
    paddingVertical: SH(14),
  },
  selectedItemRow: { backgroundColor: primaryColors.gray[100] },
  itemName: { ...body.sm.medium, color: primaryColors.gray[700] },
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
  },
  flexButton: { flex: 1 },
});

export default UOMSelectPopup;

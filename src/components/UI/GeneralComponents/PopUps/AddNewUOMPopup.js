import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Popover from "react-native-popover-view";
import { Colors, SW, SH } from "../../../../utils";
import { body } from "../../DesignSystem/typography";
import { primaryColors } from "../../DesignSystem/colorPalette";
import { Spacing } from "../../../common";
import { BottomButton } from "../BottomButton";
import { CloseOutlineIcon } from "../../../../svg";
import { usePRendpoints } from "../../../../screens/PurchaseRequest/hooks/usePRendpoints";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AddNewUOMPopup = ({ visible, onClose, onRefreshUOM }) => {
  const [uomName, setUomName] = useState("");
  const [adding, setAdding] = useState(false);
  const { handleAddUOM } = usePRendpoints(); /* Section: Logic Helpers */

  const handleAdd = async () => {
    if (!uomName.trim()) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Name is required",
      });
    }

    setAdding(true);
    await handleAddUOM(
      { addingUOM: false },
      () => {},
      uomName,
      async () => {
        await onRefreshUOM();
        onClose();
        setUomName("");
      },
      () => onClose(),
    );
    setAdding(false);
  }; /* Section: Main Render */

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
          <Text style={styles.headerTitle}>Add New UOM </Text>
          <TouchableOpacity onPress={onClose}>
            <CloseOutlineIcon
              fill={primaryColors.gray[400]}
              width={SW(18)}
              height={SH(18)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyPadding}>
          <Text style={styles.label}>UOM Name *</Text>
          <Spacing space={SH(8)} />
          <TextInput
            placeholder={"Eg. KG, Pcs, Boxes"}
            placeholderTextColor={primaryColors.gray[400]}
            value={uomName}
            onChangeText={setUomName}
            style={styles.inputField}
          />
          <Spacing space={SH(24)} />
          <View style={styles.bottomButtonContainer}>
            <BottomButton
              title={"Cancel"}
              onPress={onClose}
              type="outlined"
              style={styles.flexButton}
            />
            <BottomButton
              title={`Add UOM`}
              onPress={handleAdd}
              type="default"
              disabled={adding}
              icon={
                adding && <ActivityIndicator size={12} color={Colors.white} />
              }
              style={styles.flexButton}
            />
          </View>
        </View>
      </View>
    </Popover>
  );
};

/* Section: Stylesheet with I18n Fixes */
const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  popoverContainer: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: SW(16),
    backgroundColor: "white",
    overflow: "hidden",
  },
  innerContent: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row", // Automatically flips in RTL
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
    textAlign: "left",
  },
  bodyPadding: {
    padding: SW(20),
  },
  label: {
    ...body.xs.medium,
    color: primaryColors.gray[600],
    includeFontPadding: false,
    textAlign: "left",
  },
  inputField: {
    height: SH(44),
    borderWidth: 1,
    borderColor: primaryColors.gray[200],
    borderRadius: SW(8),
    paddingHorizontal: SW(12),
    ...body.sm.regular,
    color: primaryColors.gray[900],
    backgroundColor: primaryColors.gray[50],
    includeFontPadding: false,
    textAlign: "left",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    gap: SW(12),
  },
  flexButton: {
    flex: 1,
  },
});

export default AddNewUOMPopup;

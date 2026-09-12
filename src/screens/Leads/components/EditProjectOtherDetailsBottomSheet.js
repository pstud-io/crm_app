import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { Colors, SW, SH, SF } from "../../../utils";
import PhoneInput, { getAllCountries } from "rn-international-phone-number";
import { Dropdown } from "react-native-element-dropdown";
import {
  CloseOutlineIcon,
  DownArrowOutlineIcon,
  LocationOutline,
} from "../../../svg";
import { useSelector } from "react-redux";
import apiEndpoint from "../../../config/apiConfig";
import axios from "axios";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { useAddProjectEndpoints } from "@/components/common/AddProject/hooks/useAddProjectEndpoints";
import Toast from "react-native-toast-message";
import { useKeyboard } from "@react-native-community/hooks";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";
import { useGeneralEndpoints } from "../../../hooks/useGeneralEndpoints";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { RenderDataForDropdown } from "@/components/UI/GeneralComponents/RenderDataForDropdown";
import { formElementsStyles } from "@/design/form";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import {
  closeProjectOtherInfoBottomSheet,
  projectOtherInfoBottomSheetRef,
} from "@/components/common/ProjectInfoBottomSheetService";

function EditProjectOtherDetailsBottomSheet({ onRefresh, clientDetails }) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of add project");
      dispatch(setIsSheetOpen(false));
    };
  }, []);
  const [loading, setLoading] = useState({
    editingOtherInfo: false,
  });

  const legalNameInputRef = useRef(null);
  const [legalName, setLegalName] = useState(
    clientDetails?.client_details?.legal_name || "",
  );
  const gstNumberInputRef = useRef(null);
  const [gstNumber, setGstNumber] = useState(
    clientDetails?.client_details?.gst_number || "",
  );
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const resetEditOtherInfoBottomSheet = () => {
    setLoading((prev) => ({ ...prev, editingOtherInfo: false }));
    setLegalName("");
    setGstNumber("");
  };

  const editOtherInfo = async () => {
    setLoading((prev) => ({ ...prev, editingOtherInfo: true }));

    const payload = {
      gst_number: gstNumber,
      legal_name: legalName,
    };
    console.log("This is the payload of edit client details", payload);
    try {
      const response = await axios.put(
        `${apiEndpoint}/customers/client/?client_id=${clientDetails?.client_details?.id}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await onRefresh();
      }
    } catch (error) {
      console.error(
        "Error editing client details:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, editingOtherInfo: false }));
    } finally {
      setLoading((prev) => ({ ...prev, editingOtherInfo: false }));
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={projectOtherInfoBottomSheetRef}
        snapPoints={isKeyboardVisible ? ["100%"] : ["90%"]}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        enableBlurKeyboardOnGesture={false}
        enableHandlePanningGesture={true}
        enablePanDownToClose={true}
        stackBehavior="push"
        onAnimate={async (fromIndex, toIndex) => {
          if (fromIndex === -1 && toIndex === 0) {
            dispatch(setIsSheetOpen(true));
          }
          if (fromIndex === 0 && toIndex === -1) {
            setTimeout(() => {
              console.log("Set to false from add project");
              dispatch(setIsSheetOpen(false));
            }, [250]);
          }
        }}
        onChange={async (index) => {
          if (index < 0) {
            Keyboard.dismiss();
          }
          if (index > -1) {
            const newLegalName =
              clientDetails?.client_details?.legal_name?.toString() || "";
            const newGstNumber =
              clientDetails?.client_details?.gst_number?.toString() || "";
            setGstNumber(clientDetails?.client_details?.gst_number || "");
            setLegalName(clientDetails?.client_details?.legal_name || "");
            legalNameInputRef.current?.setNativeProps({
              text: newLegalName,
            });
            gstNumberInputRef.current?.setNativeProps({
              text: newGstNumber,
            });
          }
        }}
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0} // backdrop visible when sheet index >= 0
              disappearsOnIndex={-1} // hidden when index = -1
              opacity={0.5} // dim amount
              pressBehavior={"none"}
            />
          );
        }}
        onDismiss={() => {
          resetEditOtherInfoBottomSheet();
        }}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: SW(20),
            paddingTop: SH(12),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={formElementsStyles.titleStyle}>Other Details</Text>
          <TouchableOpacity onPress={() => closeProjectOtherInfoBottomSheet()}>
            <CloseOutlineIcon
              fill={Colors.black_text_color}
              width={SW(16)}
              height={SH(16)}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: SH(16),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: Colors.gray_line_color,
          }}
        />
        <BottomSheetScrollView
          style={{
            flex: 1,
            paddingHorizontal: 20,
            topBorderColor: Colors.gray_line_color,
            topBorderWidth: StyleSheet.hairlineWidth,
          }}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: SH(16),
            paddingBottom:
              isKeyboardVisible && keyboard.keyboardHeight - SH(60),
          }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ gap: 16, width: "100%" }}>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>Legal Name</Text>
                  <TextInput
                    placeholder="Enter Legal Name"
                    onChangeText={setLegalName}
                    defaultValue={legalName}
                    style={[
                      formElementsStyles.triggerStyle,
                      formElementsStyles.valueStyle,
                      formElementsStyles.inputContainerStyle,
                      formElementsStyles.bottomSheetInput,
                    ]}
                    placeholderTextColor={formElementsStyles.placeholderColor}
                  />
                </View>
              </View>
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                    gap: 5,
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>GST Number</Text>
                  <TextInput
                    placeholder="Enter GST Number"
                    onChangeText={setGstNumber}
                    defaultValue={gstNumber}
                    style={[
                      formElementsStyles.triggerStyle,
                      formElementsStyles.valueStyle,
                      formElementsStyles.inputContainerStyle,
                      formElementsStyles.bottomSheetInput,
                    ]}
                    placeholderTextColor={formElementsStyles.placeholderColor}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View style={formElementsStyles.bottomButtonContainer}>
          <BottomButton
            title={"Cancel"}
            onPress={() => closeProjectOtherInfoBottomSheet()}
            type={"outlined"}
          />
          <BottomButton
            title={"Edit Client"}
            onPress={async () => {
              loading.editingOtherInfo ? () => {} : await editOtherInfo();
            }}
            type={loading.editingOtherInfo ? "disabled" : "default"}
            icon={
              loading.editingOtherInfo && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(EditProjectOtherDetailsBottomSheet);

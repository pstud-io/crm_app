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
  closeProjectClientInfoBottomSheet,
  projectClientInfoBottomSheetRef,
} from "@/components/common/ProjectInfoBottomSheetService";

function EditProjectClientDetailsBottomSheet({ onRefresh, clientDetails }) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of add project");
      dispatch(setIsSheetOpen(false));
    };
  }, []);
  const [loading, setLoading] = useState({
    editingClientDetails: false,
  });

  const allCountries = getAllCountries();
  const defaultCountry = allCountries.find(
    (country) =>
      country.idd.root ===
      clientDetails?.client_details?.contact_details?.country_code,
  );
  // const defaultCountry = allCountries.find((country) => country.cioc === "IND");
  const clientNameInputRef = useRef(null);
  const [clientName, setClientName] = useState(
    clientDetails?.client_details?.contact_details?.name || "",
  );
  const clientEmailInputRef = useRef(null);
  const [clientEmail, setClientEmail] = useState(
    clientDetails?.client_details?.contact_details?.email || "",
  );
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneInputValue, setPhoneInputValue] = useState(
    clientDetails?.client_details?.contact_details?.phone || "",
  );
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const resetClientBottomSheet = () => {
    setLoading((prev) => ({ ...prev, editingClientDetails: false }));
    setClientName("");
    setClientEmail("");
    setSelectedCountry(defaultCountry);
    setPhoneInputValue("");
  };

  const editClientDetails = async () => {
    setLoading((prev) => ({ ...prev, editingClientDetails: true }));

    const payload = {
      country_code: selectedCountry.idd.root,
      email: clientEmail,
      name: clientName,
      phone: phoneInputValue,
    };
    console.log("This is the payload of edit client details", payload);
    try {
      const response = await axios.put(
        `${apiEndpoint}/core/contacts/?contact_id=${clientDetails?.client_details?.contact_details?.id}`,
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
      setLoading((prev) => ({ ...prev, editingClientDetails: false }));
    } finally {
      setLoading((prev) => ({ ...prev, editingClientDetails: false }));
    }
  };

  const handlePhoneInputValue = (phone) => {
    setPhoneInputValue(phone.replace(/\D/g, ""));
  };
  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  return (
    <>
      <BottomSheetModal
        ref={projectClientInfoBottomSheetRef}
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
            const newClientName =
              clientDetails?.client_details?.contact_details?.name?.toString() ||
              "";
            const newClientEmail =
              clientDetails?.client_details?.contact_details?.email?.toString() ||
              "";
            const contactNumber =
              clientDetails?.client_details?.contact_details?.phone
                ?.replace(/\D/g, "")
                .slice(-10);
            setPhoneInputValue(contactNumber);
            setClientEmail(
              clientDetails?.client_details?.contact_details?.email || "",
            );
            setClientName(
              clientDetails?.client_details?.contact_details?.name || "",
            );
            clientNameInputRef.current?.setNativeProps({
              text: newClientName,
            });
            clientEmailInputRef.current?.setNativeProps({
              text: newClientEmail,
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
          resetClientBottomSheet();
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
          <Text style={formElementsStyles.titleStyle}>Client Details</Text>
          <TouchableOpacity onPress={() => closeProjectClientInfoBottomSheet()}>
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
                  <Text style={formElementsStyles.titleStyle}>Name</Text>
                  <TextInput
                    placeholder="Enter Name"
                    onChangeText={setClientName}
                    defaultValue={clientName}
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
                  <Text style={formElementsStyles.titleStyle}>Email</Text>
                  <TextInput
                    placeholder="Enter Email"
                    onChangeText={setClientEmail}
                    defaultValue={clientEmail}
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
                  <Text style={formElementsStyles.titleStyle}>Phone *</Text>
                  <PhoneInput
                    value={phoneInputValue}
                    onChangePhoneNumber={handlePhoneInputValue}
                    selectedCountry={selectedCountry}
                    onChangeSelectedCountry={handleSelectedCountry}
                    placeholder="Enter Phone No."
                    placeholderTextColor={formElementsStyles.placeholderColor}
                    style={{
                      flex: 1,
                      paddingHorizontal: 8,
                      borderWidth: 0,
                      ...formElementsStyles.valueStyle,
                    }}
                    modalType="popup"
                    maxLength={10}
                    defaultCountry="IN"
                    phoneInputStyles={{
                      callingCode: formElementsStyles.titleStyle,
                      divider: {
                        height: SH(16),
                      },
                      flag: {
                        fontSize: SF(16),
                      },
                      caret: {
                        fontSize: SH(8),
                      },
                      flagContainer: {
                        padding: 0,
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      },
                      container: {
                        height: SH(44),
                        borderColor: Colors.gray_line_color,
                        borderWidth: 1,
                      },
                    }}
                    modalStyles={{
                      flag: {
                        fontSize: SH(16),
                      },
                      callingCode: {
                        ...formElementsStyles.titleStyle,
                        width: SW(50),
                        flex: 0,
                      },
                      countryName: {
                        ...formElementsStyles.titleStyle,
                        flex: 0,
                      },
                      countryItem: {
                        gap: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: 10,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.gray_line_color,
                      },
                      countryInfo: {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      },
                      searchInput: {
                        ...formElementsStyles.titleStyle,
                        padding: 0,
                        margin: 0,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.gray_text_color,
                      },
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View style={formElementsStyles.bottomButtonContainer}>
          <BottomButton
            title={"Cancel"}
            onPress={() => closeProjectClientInfoBottomSheet()}
            type={"outlined"}
          />
          <BottomButton
            title={"Edit Client"}
            onPress={async () => {
              loading.editingClientDetails
                ? () => {}
                : await editClientDetails();
            }}
            type={loading.editingClientDetails ? "disabled" : "default"}
            icon={
              loading.editingClientDetails && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(EditProjectClientDetailsBottomSheet);

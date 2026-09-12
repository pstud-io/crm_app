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
import { Colors, SW, SH } from "../../../utils";
import { getAllCountries } from "rn-international-phone-number";
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
  closeProjectInfoAddressBottomSheet,
  projectInfoAddressBottomSheetRef,
} from "@/components/common/ProjectInfoBottomSheetService";

function EditProjectAddressBottomSheet({ onRefresh, clientDetails }) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      console.log("Run cleanup of add project");
      dispatch(setIsSheetOpen(false));
    };
  }, []);
  const [loading, setLoading] = useState({
    getClientsForDropdown: false,
    getStatesForDropdown: false,
    getCitiesForDropdown: false,
    getLocation: false,
    editingAddress: false,
    addingContact: false,
    addingClient: false,
  });

  const [addressLine1, setAddressLine1] = useState(
    clientDetails?.address_details?.address_line_1 || "",
  );
  const [addressLine2, setAddressLine2] = useState(
    clientDetails?.address_details?.address_line_2 || "",
  );
  const [allStates, setAllStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState(
    clientDetails?.address_details?.location || "",
  );
  const [pinCode, setPinCode] = useState(
    clientDetails?.address_details?.pinCode || "",
  );
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const getStatesForDropdown = async () => {
    setLoading({ ...loading, getStatesForDropdown: true });
    try {
      const response = await axios.get(`${apiEndpoint}/core/state/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("State details", response.data.result);
        setAllStates([...response.data.result]);
        const stateName = clientDetails?.address_details?.state;
        const initialState =
          response.data.result.find((state) => state.name === stateName)?.id ||
          response.data.result[0].id;
        setSelectedState(initialState);
        await getCitiesForDropdown(initialState);
      }
    } catch (error) {
      console.error(
        "Error fetching states:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getStatesForDropdown: false });
    }
  };

  const getCitiesForDropdown = async (id) => {
    setLoading({ ...loading, getCitiesForDropdown: true });
    try {
      const response = await axios.get(
        `${apiEndpoint}/core/city/?state_id=${id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        // console.log("City details", response.data.result);
        const initialCity =
          response.data.result.find(
            (city) => city.name === clientDetails?.address_details?.city,
          )?.id || response.data.result[0].id;
        setAllCities([...response.data.result]);
        setSelectedCity(initialCity);
      }
    } catch (error) {
      console.error(
        "Error fetching cities:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getCitiesForDropdown: false });
    }
  };

  const fetchLocation = async () => {
    setLoading({ ...loading, getLocation: true });
    try {
      let { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status === "denied" && !canAskAgain) {
        Alert.alert(
          "Location Permission Permanently Denied",
          "Please go to your device settings to enable location permissions for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return { granted: false, coords: null };
      }

      let location = await Location.getCurrentPositionAsync({});

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const getUrl = (latitude, longitude) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        return url;
      };

      const url = getUrl(coords.latitude, coords.longitude);

      setLocation(url);
      console.log("Url", url);
      return { granted: true, coords };
    } catch (error) {
      console.error(error);
      return { granted: false, coords: null };
    } finally {
      setLoading({ ...loading, getLocation: false });
    }
  };

  const resetEditProjectInfoAddressBottomSheet = () => {
    setLoading({
      ...loading,
      getClientsForDropdown: false,
      getStatesForDropdown: false,
      getCitiesForDropdown: false,
      getLocation: false,
      editingAddress: false,
      addingContact: false,
      addingClient: false,
    });

    setAddressLine1("");
    setAddressLine2("");
    setAllStates([]);
    setSelectedState("");
    setAllCities([]);
    setSelectedCity("");
    setLocation("");
    setPinCode("");
  };

  const editAddress = async () => {
    setLoading((prev) => ({ ...prev, editingAddress: true }));

    const payload = {
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      city: allCities.find((city) => city.id === selectedCity).name,
      state: allStates.find((state) => state.id === selectedState).name,
      pincode: pinCode,
      location: location,
    };
    console.log("This is the payload of edit address", payload);
    try {
      const response = await axios.put(
        `${apiEndpoint}/core/address/?address_id=${clientDetails?.address_details?.id}`,
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
        "Error adding address:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, editingAddress: false }));
    } finally {
      setLoading((prev) => ({ ...prev, editingAddress: false }));
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={projectInfoAddressBottomSheetRef}
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
            await getStatesForDropdown();
            setPinCode(clientDetails?.address_details?.pincode);
            setAddressLine1(clientDetails?.address_details?.address_line_1);
            setAddressLine2(clientDetails?.address_details?.address_line_1);
            setLocation(clientDetails?.address_details?.location);
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
          resetEditProjectInfoAddressBottomSheet();
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
          <Text style={formElementsStyles.titleStyle}>Edit Address</Text>
          <TouchableOpacity
            onPress={() => closeProjectInfoAddressBottomSheet()}
          >
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
            gap: SH(12),
            paddingBottom:
              isKeyboardVisible && keyboard.keyboardHeight - SH(60),
          }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ width: "100%", gap: 16 }}>
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
                  <Text style={formElementsStyles.titleStyle}>
                    Address Line 1
                  </Text>
                  <TextInput
                    placeholder="Enter Address"
                    onChangeText={setAddressLine1}
                    defaultValue={addressLine1}
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
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>
                    Address Line 2
                  </Text>
                  <TextInput
                    placeholder="Enter Address"
                    onChangeText={setAddressLine2}
                    defaultValue={addressLine2}
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
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: SH(12),
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flex: 1,
                    width: "100%",
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>State *</Text>
                  <Dropdown
                    iconStyle={{ display: "none" }}
                    mode="modal"
                    activeColor="transparent"
                    style={formElementsStyles.triggerStyle}
                    placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                    itemContainerStyle={
                      formElementsStyles.dropdownOptionsItemContainerStyle
                    }
                    selectedTextStyle={formElementsStyles.valueStyle}
                    containerStyle={
                      formElementsStyles.dropdownOptionsContainerStyle
                    }
                    data={allStates}
                    labelField={!loading.getStatesForDropdown && "name"}
                    valueField={"id"}
                    searchField="name"
                    placeholder={
                      loading.getStatesForDropdown
                        ? "Fetching States..."
                        : "Select State"
                    }
                    value={loading.getStatesForDropdown ? "" : selectedState}
                    search
                    searchPlaceholder="Search State"
                    inputSearchStyle={
                      formElementsStyles.dropdownOptionsSearchStyle
                    }
                    searchPlaceholderTextColor={
                      formElementsStyles.placeholderColor
                    }
                    renderItem={(item, isSelected) => (
                      <RenderDataForDropdown
                        itemName={item.name}
                        isSelected={isSelected}
                      />
                    )}
                    autoScroll={false}
                    showsVerticalScrollIndicator={false}
                    onChange={async (item) => {
                      setSelectedState(item.id);
                      await getCitiesForDropdown(item.id);
                    }}
                    renderRightIcon={() =>
                      loading.getStatesForDropdown ? (
                        <ActivityIndicator
                          size={12}
                          color={Colors.gray_text_color}
                        />
                      ) : (
                        <DownArrowOutlineIcon width={SH(17)} height={SH(17)} />
                      )
                    }
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(6),
                    flex: 1,
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>City</Text>
                  <Dropdown
                    iconStyle={{ display: "none" }}
                    mode="modal"
                    activeColor="transparent"
                    style={formElementsStyles.triggerStyle}
                    placeholderStyle={formElementsStyles.placeholderStyle} // Placeholder font
                    itemContainerStyle={
                      formElementsStyles.dropdownOptionsItemContainerStyle
                    }
                    selectedTextStyle={formElementsStyles.valueStyle}
                    containerStyle={
                      formElementsStyles.dropdownOptionsContainerStyle
                    }
                    data={allCities}
                    labelField={!loading.getCitiesForDropdown && "name"}
                    valueField="id"
                    searchField="name"
                    placeholder={
                      loading.getCitiesForDropdown
                        ? "Fetching Cities..."
                        : "Select City"
                    }
                    value={loading.getCitiesForDropdown ? "" : selectedCity}
                    search
                    showsVerticalScrollIndicator={false}
                    searchPlaceholder="Search City"
                    inputSearchStyle={
                      formElementsStyles.dropdownOptionsSearchStyle
                    }
                    searchPlaceholderTextColor={
                      formElementsStyles.placeholderColor
                    }
                    renderItem={(item, isSelected) => (
                      <RenderDataForDropdown
                        itemName={item.name}
                        isSelected={isSelected}
                      />
                    )}
                    autoScroll={false}
                    onChange={async (item) => {
                      setSelectedCity(item.id);
                    }}
                    renderRightIcon={() =>
                      loading.getCitiesForDropdown ? (
                        <ActivityIndicator
                          size={12}
                          color={Colors.gray_text_color}
                        />
                      ) : (
                        <DownArrowOutlineIcon width={SH(17)} height={SH(17)} />
                      )
                    }
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
                    gap: SH(6),
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>PIN Code</Text>
                  <TextInput
                    placeholder="Enter PIN Code"
                    keyboardType="numeric"
                    onChangeText={setPinCode}
                    maxLength={6}
                    defaultValue={pinCode}
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
                <Text style={formElementsStyles.titleStyle}>Location</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    width: "100%",
                  }}
                >
                  <TextInput
                    placeholder={
                      loading.getLocation
                        ? "Fetching Current Location..."
                        : "Enter Location"
                    }
                    onChangeText={(newText) => {
                      if (!loading.getLocation) {
                        setLocation(newText);
                      }
                    }}
                    defaultValue={location}
                    style={[
                      formElementsStyles.triggerStyle,
                      formElementsStyles.valueStyle,
                      formElementsStyles.inputContainerStyle,
                      formElementsStyles.bottomSheetInput,
                    ]}
                    placeholderTextColor={formElementsStyles.placeholderColor}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      position: "absolute",
                      right: 14,
                      backgroundColor: "white",
                      height: SH(42),
                      paddidngRight: SW(40),
                      paddingLeft: SW(8),
                      alignItems: "center",
                    }}
                    onPress={() => {
                      !loading.getLocation && fetchLocation();
                    }}
                  >
                    {loading.getLocation ? (
                      <ActivityIndicator
                        size={12}
                        color={Colors.gray_text_color}
                      />
                    ) : (
                      <LocationOutline
                        width={16}
                        height={16}
                        stroke={Colors.gray_text_color}
                        strokeWidth={1.5}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View
          style={{
            ...formElementsStyles.bottomButtonContainer,
            // display: isHidden && "none",
          }}
        >
          <BottomButton
            title={"Change Address"}
            onPress={async () => {
              await editAddress();
            }}
            type={"default"}
            disabled={loading.editingAddress}
            icon={
              loading.editingAddress && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(EditProjectAddressBottomSheet);

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Colors, SF, SW, SH } from "../../../utils";
import PhoneInput, { getAllCountries } from "rn-international-phone-number";
import { Dropdown } from "react-native-element-dropdown";
import {
  AddOutlineIcon,
  ArrowRight,
  CloseOutlineIcon,
  DownArrowOutlineIcon,
  LocationOutline,
} from "../../../svg";
import { useSelector } from "react-redux";
import apiEndpoint from "../../../config/apiConfig";
import axios from "axios";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useAddProjectEndpoints } from "./hooks/useAddProjectEndpoints";
import { RenderDataForDropdown } from "../../UI/GeneralComponents/RenderDataForDropdown";
import { formElementsStyles } from "../../UI/Dropdown/formElementStyles";
import { Badge } from "../../UI/Badge/Badge";
import badgeColors from "../../UI/Badge/badgeColors";
import { primaryColors } from "../../UI/DesignSystem/colorPalette";
import { BottomButton } from "../../UI/GeneralComponents/BottomButton";
import Toast from "react-native-toast-message";
import { useKeyboard } from "@react-native-community/hooks";
import useKeyboardStatus from "../../../hooks/useKeyboardStatus";
import { useGeneralEndpoints } from "../../../hooks/useGeneralEndpoints";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import {
  addProjectBottomSheetRef,
  closeAddProjectBottomSheet,
} from "@/screens/dashboard/utils/addProjectBottomSheetService";
import { setIsSheetOpen } from "@/store/slices/isSheetOpenSlice";

function AddProject() {
  console.log("AddProject mounted", addProjectBottomSheetRef);
  useEffect(() => {
    console.log("BottomSheet ref:", addProjectBottomSheetRef.current);
  }, []);
  const allCountries = getAllCountries();
  const defaultCountry = allCountries.find((country) => country.cioc === "IND");
  const { triggerAutomation } = useGeneralEndpoints();
  const [loading, setLoading] = useState({
    getClientsForDropdown: false,
    getStatesForDropdown: false,
    getCitiesForDropdown: false,
    getStagesForDropdown: false,
    getLocation: false,
    addingAddress: false,
    addingContact: false,
    addingClient: false,
    addingProject: false,
  });
  const [activeForm, setActiveForm] = useState("Details");

  const [clientDetails, setClientDetails] = useState([]);
  const [client, setClient] = useState("");
  const [projectName, setProjectName] = useState("");
  const [allProjectStages, setAllProjectStages] = useState([]);
  const [projectStage, setProjectStage] = useState("");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneInputValue, setPhoneInputValue] = useState("");

  const addClientBottomSheetRef = useRef(null);
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const { getClientsForDropdown } = useAddProjectEndpoints();

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
        // console.log("State details", response.data.result);
        setAllStates([...response.data.result]);
        setSelectedState(response.data.result[0].id);
        await getCitiesForDropdown(response.data.result[0].id);
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
        setAllCities([...response.data.result]);
        setSelectedCity(response.data.result[0].id);
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

  const getStagesForDropdown = async (id) => {
    setLoading({ ...loading, getStagesForDropdown: true });
    try {
      const response = await axios.get(
        `${apiEndpoint}/customers/projectstages/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        // console.log("Lead Stages details", response.data.result);
        setAllProjectStages([...response.data.result]);
        setProjectStage(response.data.result[0]?.id);
      }
    } catch (error) {
      console.error(
        "Error fetching stages:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getStagesForDropdown: false });
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

  const resetClientBottomSheet = () => {
    setLoading((prev) => ({ ...prev, addingClient: false }));
    setClientName("");
    setClientEmail("");
    setSelectedCountry(defaultCountry);
    setPhoneInputValue("");
  };

  const resetProjectBottomSheet = () => {
    setLoading({
      ...loading,
      getClientsForDropdown: false,
      getStatesForDropdown: false,
      getCitiesForDropdown: false,
      getLocation: false,
      addingAddress: false,
      addingContact: false,
      addingClient: false,
      addingProject: false,
    });
    setActiveForm("Details");

    setClientDetails([]);
    setClient("");
    setProjectName("");
    setAllProjectStages([]);
    setProjectStage("");
    setBudget("");
    setNote("");

    setAddressLine1("");
    setAddressLine2("");
    setAllStates([]);
    setSelectedState("");
    setAllCities([]);
    setSelectedCity("");
    setLocation("");
    setPinCode("");

    resetClientBottomSheet();
  };

  const openAddClientBottomSheet = () => {
    addClientBottomSheetRef.current?.present();
  };

  function handlePhoneInputValue(phoneNumber) {
    setPhoneInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country);
  }

  const addAddress = async () => {
    setLoading((prev) => ({ ...prev, addingAddress: true }));
    // if (!addressLine1 || !pinCode) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: !addressLine1 ? "Address is required" : "Pin Code is required",
    //   });
    //   return false;
    // }
    const payload = [
      {
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        city: allCities.find((city) => city.id === selectedCity).name,
        state: allStates.find((state) => state.id === selectedState).name,
        pincode: pinCode,
        location: location,
      },
    ];
    console.log("This is the payload of add address", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/core/address/`,
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
        return response.data.result;
      }
    } catch (error) {
      console.error(
        "Error adding address:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, addingAddress: false }));
    } finally {
      setLoading((prev) => ({ ...prev, addingAddress: false }));
    }
  };

  const addContact = async () => {
    setLoading((prev) => ({ ...prev, addingContact: true }));
    function removeSpaces(text) {
      const cleaned = text.replace(/\s+/g, "");
      const isValid = /^\d{10}$/.test(cleaned);
      return isValid ? cleaned : null;
    }
    if (!clientName || !phoneInputValue) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: !clientName ? "Name is required" : "Phone Number is required",
      });
      return false;
    }

    if (!removeSpaces(phoneInputValue)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Phone Number should be exactly 10 digits",
      });
      return false;
    }

    const payload = [
      {
        country_code: selectedCountry.idd.root,
        email: clientEmail,
        name: clientName,
        phone: removeSpaces(phoneInputValue),
      },
    ];
    console.log("This is the payload of add contact", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/core/contacts/`,
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
        return response.data.result;
      }
    } catch (error) {
      console.error(
        "Error adding contact:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, addingContact: false }));
      setLoading((prev) => ({ ...prev, addingClient: false }));
    } finally {
      setLoading((prev) => ({ ...prev, addingContact: false }));
    }
  };

  const handleAddClient = async () => {
    setLoading((prev) => ({ ...prev, addingClient: true }));
    const contact = await addContact();
    if (contact === false) {
      setLoading((prev) => ({ ...prev, addingClient: false }));
      return;
    }
    const payload = {
      fk_additional_contacts: [],
      fk_contact: contact[0].id,
      fk_organization: organization_id,
      gst_number: "",
      legal_name: "",
      pan_number: "",
      remarks: "",
    };

    console.log("This is the payload of add client", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/customers/client/`,
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
        const newClient = response.data.result;
        addClientBottomSheetRef.current?.dismiss();
        await getClientsForDropdown(loading, setLoading, setClientDetails);
        setClient(newClient.id);
      }
    } catch (error) {
      console.error(
        "Error adding client:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, addingClient: false }));
    } finally {
      setLoading((prev) => ({ ...prev, addingClient: false }));
    }
  };

  const handleAddProject = async () => {
    setLoading((prev) => ({ ...prev, addingProject: true }));
    const address = await addAddress();
    if (address === false) {
      setLoading((prev) => ({ ...prev, addingProject: false }));
      return;
    }

    const payload = {
      fk_address: address[0].id,
      fk_project_stage: projectStage,
      budget: budget,
      description: note,
      fk_client: client,
      project_name: projectName,
    };

    console.log("This is the payload of add project", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/customers/project/`,
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
        const newProject = response.data.result;
        try {
          const addUserResponse = await axios.post(
            `${apiEndpoint}/customers/projectuser/?project_id=${newProject.id}`,
            { organization_contact_id: organization_contact_id },
            {
              headers: {
                Authorization: `token ${token}`,
                "X-OrganizationID": organization_id,
                "Content-Type": "application/json",
              },
            },
          );
          if (addUserResponse.status >= 200 && addUserResponse.status < 300) {
            console.log("User added successfully");
          }
        } catch (e) {
          Toast.show({
            type: "error",
            text1: "Error Occured",
            text2: error.response?.data || error.message,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
        const project = {
          id: newProject.id,
          project_name: newProject.project_name,
        };
        dispatch(setSelectedProject(project)); // Set default to 0th index
        closeAddProjectBottomSheet();
        await triggerAutomation(() => {}, {
          context_type: "create_project",
          project_id: newProject.id,
        });
      }
    } catch (error) {
      if (error.response?.data.result.fk_project_stage) {
        Toast.show({
          type: "error",
          text1: "Error Occured",
          text2: `No Lead Stage found, create one and try again`,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
      console.error(
        "Error adding New Lead:",
        error.response?.data || error.message,
      );
      setLoading((prev) => ({ ...prev, addingProject: false }));
    } finally {
      setLoading((prev) => ({ ...prev, addingProject: false }));
    }
  };

  const handleSetActiveForm = () => {
    if (!client || !projectName) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: !client ? "No Client Selected" : "Lead Name is required",
      });
      return;
    } else {
      setActiveForm("Address");
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={addProjectBottomSheetRef}
        // index={-1} // hidden by default
        snapPoints={isKeyboardVisible ? ["100%"] : ["75%"]}
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
              dispatch(setIsSheetOpen(false));
            }, [250]);
          }
        }}
        onChange={async (index) => {
          if (index < 0) {
            Keyboard.dismiss();
          }
          if (index > -1) {
            await Promise.all([
              getClientsForDropdown(loading, setLoading, setClientDetails),
              getStatesForDropdown(),
              getStagesForDropdown(),
            ]);
          }
        }}
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0} // backdrop visible when sheet index >= 0
              disappearsOnIndex={-1} // hidden when index = -1
              opacity={0.5} // dim amount
            />
          );
        }}
        onDismiss={() => {
          resetProjectBottomSheet();
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
          <Text style={formElementsStyles.titleStyle}>New Lead Details</Text>
          <TouchableOpacity onPress={() => closeAddProjectBottomSheet()}>
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
              {activeForm === "Details" ? (
                <>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: SW(8),
                    }}
                  >
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
                        Client *
                      </Text>
                      <Dropdown
                        mode="modal"
                        iconStyle={{ display: "none" }}
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
                        showsVerticalScrollIndicator={false}
                        data={clientDetails}
                        labelField={
                          !loading.getClientsForDropdown &&
                          "contact_details.name"
                        }
                        valueField="id"
                        searchField="contact_details.name"
                        placeholder={
                          loading.getClientsForDropdown
                            ? "Fetching Clients..."
                            : "Select Client"
                        }
                        value={loading.getClientsForDropdown ? "" : client}
                        search
                        searchPlaceholder="Search Client"
                        inputSearchStyle={
                          formElementsStyles.dropdownOptionsSearchStyle
                        }
                        searchPlaceholderTextColor={
                          formElementsStyles.placeholderColor
                        }
                        renderItem={(item, isSelected) => (
                          <RenderDataForDropdown
                            itemName={item.contact_details.name}
                            isSelected={isSelected}
                          />
                        )}
                        autoScroll={false}
                        onChange={(item) => {
                          setClient(item.id);
                        }}
                        renderRightIcon={() =>
                          loading.getClientsForDropdown ? (
                            <ActivityIndicator
                              size={12}
                              color={Colors.gray_text_color}
                            />
                          ) : (
                            <DownArrowOutlineIcon
                              width={SH(17)}
                              height={SH(17)}
                            />
                          )
                        }
                      />
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: SH(6),
                        // backgroundColor: "#000",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter-SemiBold",
                          fontSize: SF(11),
                          color: Colors.black_text_color,
                        }}
                      ></Text>
                      <TouchableOpacity
                        onPress={() => openAddClientBottomSheet()}
                      >
                        <Badge
                          size={"lg"}
                          color={badgeColors.blueGray}
                          border={true}
                          text={"Client"}
                          iconLeft={
                            <AddOutlineIcon
                              fill={badgeColors.blueGray.text}
                              width={SW(16)}
                              height={SH(16)}
                            />
                          }
                        />
                      </TouchableOpacity>
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
                        Lead Name *
                      </Text>
                      <TextInput
                        placeholder="Enter Lead Name"
                        onChangeText={setProjectName}
                        defaultValue={projectName}
                        style={[
                          formElementsStyles.triggerStyle,
                          formElementsStyles.valueStyle,
                          formElementsStyles.inputContainerStyle,
                          formElementsStyles.bottomSheetInput,
                        ]}
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
                        }
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
                      gap: SW(8),
                    }}
                  >
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
                      <Text style={formElementsStyles.titleStyle}>Budget</Text>
                      <TextInput
                        placeholder="Enter Budget"
                        keyboardType="numeric"
                        onChangeText={setBudget}
                        maxLength={10}
                        defaultValue={budget}
                        style={[
                          formElementsStyles.triggerStyle,
                          formElementsStyles.valueStyle,
                          formElementsStyles.inputContainerStyle,
                          formElementsStyles.bottomSheetInput,
                        ]}
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
                        }
                      />
                    </View>
                    {false && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: 5,
                          flex: 1,
                        }}
                      >
                        <Text style={formElementsStyles.titleStyle}>
                          Lead Stage
                        </Text>
                        <Dropdown
                          iconStyle={{ display: "none" }}
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
                          data={allProjectStages}
                          labelField={!loading.getStagesForDropdown && "name"}
                          valueField="id"
                          searchField="name"
                          placeholder={
                            loading.getStagesForDropdown
                              ? "Fetching Stages..."
                              : "Select Stage"
                          }
                          value={projectStage}
                          search
                          searchPlaceholder="Search Stage"
                          inputSearchStyle={
                            formElementsStyles.dropdownOptionsSearchStyle
                          }
                          searchPlaceholderTextColor={
                            formElementsStyles.placeholderColor
                          }
                          renderItem={(item, isSelected) => (
                            <RenderDataForDropdown
                              isSelected={isSelected}
                              itemName={item.name}
                            />
                          )}
                          onChange={async (item) => {
                            setProjectStage(item.id);
                          }}
                          renderRightIcon={() =>
                            loading.getStagesForDropdown ? (
                              <ActivityIndicator
                                size={12}
                                color={Colors.gray_text_color}
                              />
                            ) : (
                              <DownArrowOutlineIcon
                                width={SH(17)}
                                height={SH(17)}
                              />
                            )
                          }
                        />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      flex: 1,
                      gap: SH(6),
                      width: "100%",
                    }}
                  >
                    <Text style={formElementsStyles.titleStyle}>
                      Description
                    </Text>
                    <TextInput
                      defaultValue={note}
                      onChangeText={setNote}
                      placeholder="Enter Description"
                      multiline
                      numberOfLines={4}
                      style={[
                        formElementsStyles.triggerStyle,
                        formElementsStyles.valueStyle,
                        formElementsStyles.inputContainerStyle,
                        formElementsStyles.bottomSheetDescription,
                      ]}
                      placeholderTextColor={formElementsStyles.placeholderColor}
                    />
                  </View>
                </>
              ) : (
                <>
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
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
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
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
                        }
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
                        value={
                          loading.getStatesForDropdown ? "" : selectedState
                        }
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
                            <DownArrowOutlineIcon
                              width={SH(17)}
                              height={SH(17)}
                            />
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
                            <DownArrowOutlineIcon
                              width={SH(17)}
                              height={SH(17)}
                            />
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
                      <Text style={formElementsStyles.titleStyle}>
                        PIN Code
                      </Text>
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
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
                        }
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
                      marginBottom: SH(16),
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
                        placeholderTextColor={
                          formElementsStyles.placeholderColor
                        }
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
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View
          style={{
            ...formElementsStyles.bottomButtonContainer,
            // display: isHidden && "none",
          }}
        >
          {activeForm === "Address" && (
            <BottomButton
              title={"Back"}
              onPress={() => setActiveForm("Details")}
              type={"outlined"}
              iconLeft={
                <ArrowRight
                  width={10}
                  height={10}
                  strokeWidth={1.5}
                  stroke={primaryColors.button.active}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              }
            />
          )}
          <BottomButton
            title={activeForm === "Details" ? "Next" : "Add Lead"}
            onPress={() => {
              activeForm === "Details"
                ? handleSetActiveForm()
                : handleAddProject();
            }}
            type={"default"}
            disabled={loading.addingProject}
            icon={
              loading.addingProject && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={addClientBottomSheetRef}
        // index={-1} // hidden by default
        snapPoints={isKeyboardVisible ? ["100%"] : ["60%"]}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        enableHandlePanningGesture={true}
        enablePanDownToClose={true}
        onClose={resetClientBottomSheet}
        stackBehavior="push"
        onChange={(index) => {
          if (index < 0) {
            Keyboard.dismiss();
          }
        }}
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0} // backdrop visible when sheet index >= 0
              disappearsOnIndex={-1} // hidden when index = -1
              opacity={0.5} // dim amount
            />
          );
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
          <TouchableOpacity
            onPress={() => addClientBottomSheetRef.current?.dismiss()}
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
                  <Text style={formElementsStyles.titleStyle}>Name *</Text>
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
                    maxLength={11}
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
            title={"Reset"}
            onPress={resetClientBottomSheet}
            type={"outlined"}
          />
          <BottomButton
            title={"Add Client"}
            onPress={async () => {
              loading.addingClient ? () => {} : await handleAddClient();
            }}
            type={loading.addingClient ? "disabled" : "default"}
            icon={
              loading.addingClient && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(AddProject);

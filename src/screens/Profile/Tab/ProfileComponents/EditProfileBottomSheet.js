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
import React, { createRef, useEffect, useRef, useState } from "react";
import { Colors, SW, SH } from "@/utils";
import { Dropdown } from "react-native-element-dropdown";
import {
  CloseOutlineIcon,
  DownArrowOutlineIcon,
  ReloadOutline,
  UploadCloudOutline,
} from "@/svg";
import { useSelector } from "react-redux";
import apiEndpoint from "@/config/apiConfig";
import axios from "axios";
import { useKeyboard } from "@react-native-community/hooks";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import { RenderDataForDropdown } from "@/components/UI/GeneralComponents/RenderDataForDropdown";
import { BottomButton } from "@/components/UI/GeneralComponents/BottomButton";
import { formElementsStyles } from "@/components/UI/Dropdown/formElementStyles";
import { Spacing } from "@/components";
import { primaryColors } from "@/components/UI/DesignSystem/colorPalette";
import { body } from "@/components/UI/DesignSystem/typography";
import { useCameraScreen } from "@/hooks/useCameraScreen";
import { RenderAssets } from "@/components/UI/GeneralComponents/RenderAssets";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import Toast from "react-native-toast-message";
import { RenderSingleAsset } from "@/components/UI/GeneralComponents/RenderSingleAsset";
import { lightShadows } from "@/design/shadows";

export const editProfileBottomSheetRef = createRef();

export const openEditProfileBottomSheet = () => {
  editProfileBottomSheetRef.current?.present();
};

export const closeEditProfileBottomSheet = () => {
  editProfileBottomSheetRef.current?.dismiss();
};

function EditProfileBottomSheet({ onRefresh, userDetails }) {
  const project = useSelector((state) => state.project.selectedProject);
  const [loading, setLoading] = useState({
    getStatesForDropdown: false,
    getCitiesForDropdown: false,
    editingProfile: false,
    loadingText: "Editing Profile...",
  });
  const [selectedPANMedia, setSelectedPANMedia] = useState([]);
  const { handleSelectMedia: handleSelectPANMedia } = useCameraScreen({
    setSelectedMedia: setSelectedPANMedia,
    maxMediaLength: 1,
    replace: true,
  });

  const [selectedAADHARMedia, setSelectedAADHARMedia] = useState([]);
  const { handleSelectMedia: handleSelectAADHARMedia } = useCameraScreen({
    setSelectedMedia: setSelectedAADHARMedia,
    maxMediaLength: 1,
    replace: true,
  });

  const [selectedProfileMedia, setSelectedProfileMedia] = useState([]);
  const { handleSelectMedia: handleSelectProfileMedia } = useCameraScreen({
    setSelectedMedia: setSelectedProfileMedia,
    maxMediaLength: 1,
    replace: true,
  });

  const [address, setAddress] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [panCard, setPanCard] = useState("");
  const [aadhar, setAadhar] = useState("");
  const keyboard = useKeyboard();
  const isKeyboardVisible = useKeyboardStatus();
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const { uploadMedia } = useGeneralEndpoints();
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
        const stateName = userDetails?.basic_details?.state;
        const initialState =
          response.data.result.find((state) => state.name === stateName)?.id ||
          "";
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
            (city) => city.name === userDetails?.basic_details?.city,
          )?.id || "";
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

  const resetEditProfileBottomSheet = () => {
    setLoading({
      getStatesForDropdown: false,
      getCitiesForDropdown: false,
      editingProfile: false,
      loadingText: "Editing Profile",
    });
    setAddress("");
    setAllStates([]);
    setSelectedState("");
    setAllCities([]);
    setSelectedCity("");
    setSelectedPANMedia([]);
    setSelectedAADHARMedia([]);
    setSelectedProfileMedia([]);
  };

  const editProfile = async () => {
    const isValidPAN = (pan) => {
      return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
    };
    if (!isValidPAN(panCard)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "PAN Card should be of the format ABCDE1234F",
      });
      return;
    }
    if (aadhar?.length < 12) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "AADHAR Card Number should be 12 digits",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, editingProfile: true }));

    try {
      let fk_pan_asset = userDetails?.basic_details?.pan_asset_details?.id
        ? userDetails?.basic_details?.pan_asset_details?.id
        : "";
      let fk_aadhaar_asset = userDetails?.basic_details?.aadhaar_asset_details
        ?.id
        ? userDetails?.basic_details?.aadhaar_asset_details?.id
        : "";
      let fk_asset = userDetails?.basic_details?.asset_details?.id
        ? userDetails?.basic_details?.asset_details?.id
        : "";

      if (selectedPANMedia.length > 0 && selectedPANMedia[0]?.uri) {
        setLoading((prev) => ({
          ...prev,
          loadingText: "Uploading PAN Card...",
        }));
        const PANAssetResponse = await uploadMedia(
          selectedPANMedia,
          project?.id,
        );
        if (PANAssetResponse.status >= 200 && PANAssetResponse.status < 300) {
          fk_pan_asset = PANAssetResponse.data.result[0]?.id || "";
        }
      }
      if (selectedAADHARMedia.length > 0 && selectedAADHARMedia[0]?.uri) {
        setLoading((prev) => ({
          ...prev,
          loadingText: "Uploading AADHAR Card...",
        }));
        const AADHARAssetResponse = await uploadMedia(
          selectedAADHARMedia,
          project?.id,
        );
        if (
          AADHARAssetResponse.status >= 200 &&
          AADHARAssetResponse.status < 300
        ) {
          fk_aadhaar_asset = AADHARAssetResponse.data.result[0]?.id || "";
        }
      }
      if (selectedProfileMedia.length > 0 && selectedProfileMedia[0]?.uri) {
        setLoading((prev) => ({
          ...prev,
          loadingText: "Uploading Profile Picture...",
        }));
        const ProfileAssetResponse = await uploadMedia(
          selectedProfileMedia,
          project?.id,
        );
        if (
          ProfileAssetResponse.status >= 200 &&
          ProfileAssetResponse.status < 300
        ) {
          fk_asset = ProfileAssetResponse.data.result[0]?.id || "";
        }
      }
      const payload = {
        address: address,
        city: allCities.find((city) => city?.id === selectedCity)?.name || "",
        state:
          allStates.find((state) => state?.id === selectedState)?.name || "",
        aadhaar_number: aadhar,
        pan_number: panCard,
        fk_aadhaar_asset,
        fk_pan_asset,
        fk_asset,
      };
      console.log("This is the payload of edit profile", payload);
      setLoading((prev) => ({
        ...prev,
        loadingText: "Editing Profile...",
      }));
      const response = await axios.put(
        `${apiEndpoint}/auth/usercreate/?organization_contact_id=${userDetails?.basic_details?.id}`,
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
        closeEditProfileBottomSheet();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to edit profile. Check your network connection.",
      });
      setLoading((prev) => ({ ...prev, editingProfile: false }));
    } finally {
      setLoading((prev) => ({ ...prev, editingProfile: false }));
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={editProfileBottomSheetRef}
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
            setAddress(userDetails?.basic_details?.address);
            setPanCard(userDetails?.basic_details?.pan);
            setAadhar(userDetails?.basic_details?.aadhar);
            if (userDetails?.basic_details?.pan_asset_details?.url) {
              setSelectedPANMedia([
                userDetails?.basic_details?.pan_asset_details,
              ]);
            }
            if (userDetails?.basic_details?.aadhaar_asset_details?.url) {
              setSelectedAADHARMedia([
                userDetails?.basic_details?.aadhaar_asset_details,
              ]);
            }
            if (userDetails?.basic_details?.asset_details?.url) {
              setSelectedProfileMedia([
                userDetails?.basic_details?.asset_details,
              ]);
            }
          }
        }}
        onChange={async (index) => {
          if (index < 0) {
            Keyboard.dismiss();
          }
          if (index > -1) {
            await getStatesForDropdown();
            setAddress(userDetails?.basic_details?.address);
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
          resetEditProfileBottomSheet();
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
          <TouchableOpacity onPress={() => closeEditProfileBottomSheet()}>
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
              20 + (isKeyboardVisible ? keyboard.keyboardHeight - SH(60) : 0),
          }}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ width: "100%", gap: 20 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(8),
                  flex: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>
                    Profile Picture
                  </Text>
                  {selectedProfileMedia?.length > 0 && (
                    <TouchableOpacity
                      onPress={() => handleSelectProfileMedia()}
                    >
                      <ReloadOutline
                        width={12}
                        height={12}
                        fill={primaryColors.gray[900]}
                        stroke={1}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {selectedProfileMedia.length > 0 ? (
                  <RenderSingleAsset
                    assets={selectedProfileMedia}
                    style={{
                      width: "100%",
                      height: 96,
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: lightShadows.md,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      ...formElementsStyles.attachFilesTriggerStyle,
                      height: 96,
                    }}
                    onPress={async () => await handleSelectProfileMedia()}
                  >
                    <UploadCloudOutline
                      width={SW(24)}
                      height={SH(24)}
                      stroke={primaryColors.brand[1000]}
                    />
                    <Text
                      style={{
                        ...body.sm.medium,
                        color: primaryColors.brand[1000],
                        marginLeft: SW(8),
                      }}
                    >
                      Upload Profile Picture
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(8),
                  flex: 1,
                }}
              >
                <Text style={formElementsStyles.titleStyle}>PAN Card</Text>
                <TextInput
                  defaultValue={panCard}
                  onChangeText={setPanCard}
                  placeholder="Enter PAN Card Number"
                  style={[
                    formElementsStyles.triggerStyle,
                    formElementsStyles.valueStyle,
                    formElementsStyles.inputContainerStyle,
                    formElementsStyles.placeholderColor,
                    {
                      borderBottomWidth: SW(1),
                    },
                  ]}
                  maxLength={10}
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(8),
                  flex: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>PAN Image</Text>
                  {selectedPANMedia?.length > 0 && (
                    <TouchableOpacity onPress={() => handleSelectPANMedia()}>
                      <ReloadOutline
                        width={12}
                        height={12}
                        fill={primaryColors.gray[900]}
                        stroke={1}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {selectedPANMedia.length > 0 ? (
                  <RenderSingleAsset
                    assets={selectedPANMedia}
                    style={{
                      width: "100%",
                      height: 96,
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: lightShadows.md,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      ...formElementsStyles.attachFilesTriggerStyle,
                      height: 96,
                    }}
                    onPress={async () => await handleSelectPANMedia()}
                  >
                    <UploadCloudOutline
                      width={SW(24)}
                      height={SH(24)}
                      stroke={primaryColors.brand[1000]}
                    />
                    <Text
                      style={{
                        ...body.sm.medium,
                        color: primaryColors.brand[1000],
                        marginLeft: SW(8),
                      }}
                    >
                      Upload PAN Image
                    </Text>
                  </TouchableOpacity>
                )}
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
                <Text style={formElementsStyles.titleStyle}>AADHAR Card</Text>
                <TextInput
                  defaultValue={aadhar}
                  onChangeText={setAadhar}
                  placeholder="Enter AADHAR Card Number"
                  style={[
                    formElementsStyles.triggerStyle,
                    formElementsStyles.valueStyle,
                    formElementsStyles.inputContainerStyle,
                    formElementsStyles.placeholderColor,
                    {
                      borderBottomWidth: SW(1),
                    },
                  ]}
                  keyboardType="numeric"
                  maxLength={12}
                />
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(8),
                  flex: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={formElementsStyles.titleStyle}>
                    AADHAR Image
                  </Text>
                  {selectedAADHARMedia?.length > 0 && (
                    <TouchableOpacity onPress={() => handleSelectAADHARMedia()}>
                      <ReloadOutline
                        width={12}
                        height={12}
                        fill={primaryColors.gray[900]}
                        stroke={1}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {selectedAADHARMedia.length > 0 ? (
                  <RenderSingleAsset
                    assets={selectedAADHARMedia}
                    style={{
                      width: "100%",
                      height: 96,
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: lightShadows.md,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      ...formElementsStyles.attachFilesTriggerStyle,
                      height: 96,
                    }}
                    onPress={async () => await handleSelectAADHARMedia()}
                  >
                    <UploadCloudOutline
                      width={SW(24)}
                      height={SH(24)}
                      stroke={primaryColors.brand[1000]}
                    />
                    <Text
                      style={{
                        ...body.sm.medium,
                        color: primaryColors.brand[1000],
                        marginLeft: SW(8),
                      }}
                    >
                      Upload AADHAR Image
                    </Text>
                  </TouchableOpacity>
                )}
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
                  <Text style={formElementsStyles.titleStyle}>Address</Text>
                  <TextInput
                    placeholder="Enter Address"
                    onChangeText={setAddress}
                    defaultValue={address}
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
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetScrollView>
        <View
          style={{
            ...formElementsStyles.bottomButtonContainer,
          }}
        >
          <BottomButton
            title={
              loading?.editingProfile ? loading?.loadingText : "Edit Profile"
            }
            onPress={async () => {
              await editProfile();
            }}
            type={"default"}
            disabled={loading.editingProfile}
            icon={
              loading.editingProfile && (
                <ActivityIndicator size={10} color="white" />
              )
            }
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
export default React.memo(EditProfileBottomSheet);

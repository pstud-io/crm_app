import React, { useEffect, useCallback, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Colors, SH, SW } from "../../../utils";
import {
  Spacing,
  Modal as ConfirmationModal,
} from "../../../components/common";

import { useSelector, useDispatch } from "react-redux";
import { removeToken } from "@/store/slices/authSlice/authSlice";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { removePermissionsFromStorage } from "../../../store/slices/permissionSlice";
import { removeProfile } from "@/store/slices/profileSlice/profileSlice";
import images from "../../../images";
import axios from "axios";
import apiEndpoint from "../../../config/apiConfig";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { primaryColors } from "../../../components/UI/DesignSystem/colorPalette";
import { body } from "../../../components/UI/DesignSystem/typography";
import {
  getAccountSettings,
  getBasicDetails,
} from "./ProfileComponents/profileUtil";
import { MenuItem } from "./ProfileComponents/MenuItem";
import { ItemSeparatorComponent } from "../../../components/UI/GeneralComponents/ItemSeperatorComponent";
import { LinearGradient } from "expo-linear-gradient";
import { setActiveSubButtonGlobal } from "../../../store/slices/activeSubButtonGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSyncDataCheckGlobal } from "../../../store/slices/syncDataCheckGlobal";
import { useNavigation } from "@react-navigation/native";
import { logOut } from "@/utils/authFunctions";
import { useAuth } from "@/hooks/useAuth";
import { useGeneralEndpoints } from "@/hooks/useGeneralEndpoints";
import { lightShadows } from "@/design/shadows";
import { SubTabChip } from "@/components/UI/GeneralComponents/SubTabChip";
import UserDetailsCard from "./ProfileComponents/UserDetailsCard";
import EditProfileBottomSheet, {
  openEditProfileBottomSheet,
} from "./ProfileComponents/EditProfileBottomSheet";
import { EditOutline } from "@/svg";
const ProfileTab = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [userAdditionalDetails, setUserAdditionalDetails] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const { setAuthLoading, setRole } = useAuth();
  const organization_id = useSelector((state) => state.profile.organization_id);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [activeSubButton, setActiveSubButton] = useState("basic");
  const [loading, setLoading] = useState({
    deleteAccount: false,
    getUserDetails: false,
    getUserSummary: false,
    getUserAdditionalDetails: false,
  });

  const { getUserDetails, getUserSummary, getUserAdditionalDetails } =
    useGeneralEndpoints();

  const fetchData = async () => {
    await Promise.all([
      getUserDetails(setLoading, setUserDetails),
      getUserSummary(setLoading, setUserSummary),
      getUserAdditionalDetails(setLoading, setUserAdditionalDetails),
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("profile"));
      fetchData();
    }, []),
  );

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    renderCancelButton: false,
    logOutModal: false,
    deleteAccountModal: false,
    deleteSyncModal: false,
  });

  const setModalState = (newState) => {
    setModal((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const closeModal = () => {
    setModal({
      visible: false,
      title: "",
      message: "",
      renderCancelButton: false,
      logOutModal: false,
      deleteAccountModal: false,
      deleteSyncModal: false,
    });
  };

  const closeModalAndLogout = async () => {
    setModal({
      visible: false,
      title: "",
      message: "",
      renderCancelButton: false,
      logOutModal: false,
      deleteAccountModal: false,
      deleteSyncModal: false,
    });
    await removeToken(dispatch);
    await removePermissionsFromStorage(dispatch);
    await removeProfile(dispatch);
    dispatch(setSelectedProject({ id: null, project_name: null })); // Set default to 0th index
    await logOut(setRole, setAuthLoading);
  };

  const cleanSyncData = async () => {
    setModalState({
      visible: true,
      title: "Are you sure?",
      message: "Deleting your sync data will clean all stored progress",
      renderCancelButton: true,
      deleteSyncModal: true,
    });
  };

  const deleteSyncData = async () => {
    setModal({
      visible: false,
      title: "",
      message: "",
      renderCancelButton: false,
      logOutModal: false,
      deleteAccountModal: false,
      deleteSyncModal: false,
    });
    await AsyncStorage.removeItem("sync");
    dispatch(
      setSyncDataCheckGlobal({
        hasData: false,
        count: 0,
      }),
    );
  };

  const deleteAccount = async () => {
    setLoading({ ...loading, deleteAccount: true });

    try {
      const response = await axios.delete(
        `${apiEndpoint}/auth/usercreate/?organization_contact_id=${organization_contact_id}`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      console.log("response:", response.data.result);

      if (response.status >= 200 && response.status < 300) {
        closeModalAndLogout();
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }

      setModalState({
        visible: true,
        title: "Error",
        message:
          error.response?.data?.result ||
          "Failed to delete account. Check your network connection.",
      });
    } finally {
      setLoading({ ...loading, deleteAccount: false });
    }
  };

  const handleLogout = () => {
    setModalState({
      visible: true,
      title: "Log Out",
      message: "Are you sure you want to log out?",
      renderCancelButton: true,
      logOutModal: true,
    });
  };
  console.log("Profile", profile);

  const getInitials = (name) => {
    if (!name) return "";

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const subButtons = [
    { id: "basic", title: "Basic Details" },
    { id: "employment", title: "Employment Details" },
    { id: "settings", title: "Account Settings" },
  ];

  const basicDetails = Object.entries(userDetails?.basic_details ?? {})
    .filter(([key, value]) => key !== "asset_details" && value != null)
    .map(([key, value]) => ({
      id: key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: String(value),
    }))
    .filter((detail) => {
      return detail.label !== "Id";
    });

  const employmentDetails = Object.entries(
    userDetails?.employement_details ?? {},
  )
    .filter(([key, value]) => value != null)
    .map(([key, value]) => ({
      id: key,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: String(value),
    }))
    .filter((detail) => {
      return detail.label !== "Id";
    });

  console.log("These are the employ details", employmentDetails);

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: primaryColors.gray[50],
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: SW(15),
            paddingBottom: 88,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ width: "100%", alignItems: "flex-start", borderWidth: 0 }}
          >
            <Spacing space={SH(20)} />

            <View
              style={{
                backgroundColor: Colors.theme_background,
                borderRadius: SW(20),
                borderWidth: SW(2),
                borderColor: primaryColors.gray[200],
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 0,
                width: "100%",
                gap: SW(16),
                paddingVertical: 40,
                boxShadow: lightShadows.xxl,
              }}
            >
              {userDetails?.basic_details?.asset_details?.url ? (
                <Image
                  source={{
                    uri: userDetails?.basic_details?.asset_details?.url,
                  }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: SW(72),
                  }}
                  width={72}
                  height={72}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={["#6E533E", "#968274"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    borderRadius: SH(72),
                    borderWidth: 0,
                    overflow: "hidden",
                    backgroundColor: "#000fff",
                    width: SH(72),
                    height: SH(72),
                  }}
                >
                  <Text
                    style={{
                      ...body.xxl.medium,
                      color: primaryColors.gray[25],
                    }}
                  >
                    {getInitials(profile.name)}
                  </Text>
                </LinearGradient>
              )}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  borderWidth: 0,
                  flexGrow: 1,
                }}
              >
                <Text
                  style={{
                    ...body.xxl.semiBold,
                    color: primaryColors.brand[1000],
                  }}
                >
                  {`${profile.name}`}
                </Text>
                {userDetails?.basic_details?.dob && (
                  <Text
                    style={{
                      ...body.md.semiBold,
                      color: Colors.primary,
                    }}
                  >
                    {userDetails?.basic_details?.dob}
                  </Text>
                )}
              </View>
            </View>
            <Spacing space={SH(24)} />
            <FlatList
              horizontal
              data={subButtons}
              contentContainerStyle={{
                height: SH(40),
              }}
              style={{ maxHeight: SH(40) }}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const isActive = item.id === activeSubButton;
                return (
                  <SubTabChip
                    type={isActive ? "default" : "outlined"}
                    title={item.title}
                    index={index}
                    onPress={() => setActiveSubButton(item.id)}
                  />
                );
              }}
            />
            <Spacing space={SH(24)} />
            {activeSubButton === "basic" && (
              <>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Contact
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"Phone"}
                      value={userDetails?.basic_details?.phone}
                    />
                    <UserDetailsCard
                      label={"Email"}
                      value={userDetails?.basic_details?.email}
                    />
                    <UserDetailsCard
                      label={"Company Email"}
                      value={userDetails?.basic_details?.company_email}
                    />
                    <UserDetailsCard
                      label={"Alternate Name"}
                      value={userDetails?.basic_details?.alternate_contact_name}
                    />
                    <UserDetailsCard
                      label={"Alternate Phone"}
                      value={
                        userDetails?.basic_details?.alternate_contact_number
                      }
                    />
                    <UserDetailsCard
                      label={"Beneficiary"}
                      value={userDetails?.basic_details?.beneficiary_name}
                      hasBorder={false}
                    />
                  </View>
                </View>
                <Spacing space={SH(24)} />
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Address
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"City"}
                      value={userDetails?.basic_details?.city}
                    />
                    <UserDetailsCard
                      label={"State"}
                      value={userDetails?.basic_details?.state}
                    />
                    <UserDetailsCard
                      label={"Full Address"}
                      value={userDetails?.basic_details?.address}
                      type={"address"}
                      hasBorder={false}
                    />
                  </View>
                </View>
                <Spacing space={SH(24)} />
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Documents
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"PAN Card"}
                      value={userDetails?.basic_details?.pan}
                    />
                    <UserDetailsCard
                      label={"PAN Card Image"}
                      value={userDetails?.basic_details?.pan_asset_details}
                      type={"asset"}
                    />
                    <UserDetailsCard
                      label={"AADHAAR Card"}
                      value={userDetails?.basic_details?.aadhar}
                    />
                    <UserDetailsCard
                      label={"AADHAAR Card Image"}
                      value={userDetails?.basic_details?.aadhaar_asset_details}
                      type={"asset"}
                    />
                  </View>
                </View>
                {userAdditionalDetails.length > 0 && (
                  <>
                    <Spacing space={SH(24)} />
                    <View
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: SH(12),
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={{
                            ...body.sm.semiBold,
                            color: primaryColors.brand[1000],
                          }}
                        >
                          Additional Details
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          borderRadius: SW(12),
                          borderWidth: SW(1),
                          borderColor: primaryColors.gray[200],
                          backgroundColor: "white",
                          overflow: "hidden",
                        }}
                      >
                        {userAdditionalDetails.map((additionalDetail) => {
                          const value =
                            userDetails?.custom_field_details?.find(
                              (customFieldDetail) =>
                                customFieldDetail.custom_field_details.id ===
                                additionalDetail.id,
                            )?.value || "NA";
                          console.log("Value is ", value);
                          return (
                            <UserDetailsCard
                              key={additionalDetail.id}
                              label={additionalDetail.name}
                              value={value}
                              type={
                                additionalDetail.type === "checkbox"
                                  ? "checkbox"
                                  : "value"
                              }
                            />
                          );
                        })}
                      </View>
                    </View>
                  </>
                )}
              </>
            )}
            {activeSubButton === "employment" && (
              <>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Salary
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"Annual Salary"}
                      value={userDetails?.employement_details?.annual_salary}
                    />
                    <UserDetailsCard
                      label={"Variable"}
                      value={userDetails?.employement_details?.variabale_pay}
                    />
                    <UserDetailsCard
                      label={"Tax Deductions (monthly)"}
                      value={userDetails?.employement_details?.tax_deductions}
                    />
                    <UserDetailsCard
                      label={"Salary in-hand"}
                      hasBorder={false}
                      value={
                        userDetails?.employement_details?.monthly_hand_salary
                      }
                    />
                  </View>
                </View>
                <Spacing space={SH(24)} />
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Job
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"Employment Type"}
                      value={userDetails?.employement_details?.employement_type}
                    />
                    <UserDetailsCard
                      label={"Joining Date"}
                      value={userDetails?.employement_details?.joining_date}
                    />
                    <UserDetailsCard
                      label={"Reporting Manager"}
                      value={
                        userDetails?.employement_details?.reporting_manager
                      }
                    />
                    <UserDetailsCard
                      label={"Designation"}
                      value={userDetails?.basic_details?.designation}
                      hasBorder={false}
                    />
                  </View>
                </View>
                <Spacing space={SH(24)} />
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: SH(12),
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        ...body.sm.semiBold,
                        color: primaryColors.brand[1000],
                      }}
                    >
                      Bank Details
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      borderRadius: SW(12),
                      borderWidth: SW(1),
                      borderColor: primaryColors.gray[200],
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <UserDetailsCard
                      label={"Bank Name"}
                      value={userDetails?.employement_details?.bank_name}
                    />
                    <UserDetailsCard
                      label={"Account Number"}
                      value={userDetails?.employement_details?.account_number}
                    />
                    <UserDetailsCard
                      label={"IFSC Code"}
                      value={userDetails?.employement_details?.ifsc_code}
                      hasBorder={false}
                    />
                  </View>
                </View>
              </>
            )}
            {activeSubButton === "settings" && (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: SH(12),
                }}
              >
                <FlatList
                  data={getAccountSettings(
                    navigation,
                    handleLogout,
                    cleanSyncData,
                  )}
                  horizontal={false}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    return (
                      <MenuItem
                        label={item.label}
                        labelColor={item.labelColor}
                        leftIcon={item.leftIcon}
                        leftIconTheme={item.leftIconTheme}
                        hasRightIcon={item.hasRightIcon}
                        rightIcon={item.rightIcon}
                        onPress={item.onPress}
                      />
                    );
                  }}
                  style={{
                    width: "100%",
                    marginBottom: SH(16),
                    borderRadius: SW(12),
                    borderWidth: SW(1),
                    borderColor: primaryColors.gray[200],
                  }}
                  contentContainerStyle={{
                    width: "100%",
                    backgroundColor: "white",
                  }}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <ItemSeparatorComponent
                      direction={"horizontal"}
                      style={{ marginVertical: 0 }}
                    />
                  )}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <ConfirmationModal
          visible={modal.visible}
          title={modal.title}
          message={modal.message}
          onOkayPress={
            modal.logOutModal
              ? closeModalAndLogout
              : modal.deleteAccountModal
                ? deleteAccount
                : modal.deleteSyncModal
                  ? deleteSyncData
                  : closeModal
          }
          onCancelPress={closeModal}
          renderCancelButton={modal.renderCancelButton}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: primaryColors.gray[900],
            borderRadius: 999,
            width: 48,
            height: 48,
            bottom: 28,
            right: 28,
            boxShadow: lightShadows.md,
          }}
          activeOpacity={0.9}
          onPress={() => openEditProfileBottomSheet()}
        >
          <EditOutline
            width={SH(18)}
            height={SH(18)}
            fill={primaryColors.gray[25]}
            strokeWidth={0}
          />
        </TouchableOpacity>
      </View>
      <EditProfileBottomSheet
        onRefresh={async () => await fetchData()}
        userDetails={userDetails}
      />
    </>
  );
};

export default ProfileTab;

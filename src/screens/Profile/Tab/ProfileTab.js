import React, { useEffect, useCallback, useState } from "react";
import { Text, View, ScrollView, Image, FlatList } from "react-native";
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
const ProfileTab = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const { setAuthLoading, setRole } = useAuth();
  const organization_id = useSelector((state) => state.profile.organization_id);
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({
    deleteAccount: false,
  });

  const isFocused = useIsFocused();
  const activeTabButtonID = useSelector(
    (state) => state.activeSubButtonGlobal.activeSubButtonGlobal,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveSubButtonGlobal("profile"));
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

  const handleEditProfile = () => {
    navigation.navigate("ResetPassword");
  };

  const handleReviewAccount = () => {
    navigation.navigate("AccountSettings");
  };

  const handleDeleteAccount = () => {
    setModalState({
      visible: true,
      title: "Are you sure?",
      message:
        "Deleting your account will not delete the tasks/activities/projects created by you.",
      renderCancelButton: true,
      deleteAccountModal: true,
    });
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
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primaryColors.gray[50],
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: SW(15) }}
      >
        <View
          style={{ width: "100%", alignItems: "flex-start", borderWidth: 0 }}
        >
          <Spacing space={SH(20)} />

          <View
            style={{
              padding: SH(20),
              backgroundColor: Colors.theme_background,
              borderRadius: SW(12),
              borderWidth: SW(2),
              borderColor: primaryColors.gray[200],
              backgroundColor: "white",
              elevation: 1,
              shadowColor: "#0A0D12",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0,
              width: "100%",
              gap: SW(12),
            }}
          >
            <LinearGradient
              colors={["#6E533E", "#968274"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // left → right
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: SH(48),
                borderWidth: 0,
                overflow: "hidden",
                backgroundColor: "#000fff",
                width: SH(48),
                height: SH(48),
              }}
            >
              <Text
                style={{
                  ...body.sm.medium,
                  color: primaryColors.gray[25],
                }}
              >
                AA
              </Text>
            </LinearGradient>
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
                  ...body.xl.semiBold,
                  color: primaryColors.brand[1000],
                }}
              >
                {`${profile.name}`}
              </Text>
              <Text
                style={{
                  ...body.md.semiBold,
                  color: Colors.primary,
                }}
              >
                {`Role`}
              </Text>
            </View>
            {/* <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                borderRadius: SH(48),
                borderWidth: 0,
                overflow: "hidden",
                backgroundColor: "#000fff",
                width: SH(48),
                height: SH(48),
              }}
            >
              <Text
                style={{
                  ...body.sm.medium,
                  color: primaryColors.gray[25],
                }}
              >
                AA
              </Text>
            </View> */}
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
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              Basic Details
            </Text>
            <FlatList
              data={getBasicDetails(profile).filter((item) => {
                if (item.id === "email_details" && !item.label) return false;
                if (item.id === "address_details" && !item.label) return false;
                return true;
              })}
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
            <Text
              style={{ ...body.sm.semiBold, color: primaryColors.brand[1000] }}
            >
              Account Settings
            </Text>
            <FlatList
              data={getAccountSettings(navigation, handleLogout, cleanSyncData)}
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
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: SH(20),
          backgroundColor: Colors.theme_background,
          borderWidth: 0,
          borderColor: Colors.blue_color,
        }}
      >
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{
            height: SH(28),
          }}
        />
        <Text
          style={{
            ...body.xs.regular,
            color: Colors.dark_gray_text_color,
            marginTop: SH(8),
          }}
        >
          Version 4.0.5
        </Text>
      </View>
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
    </View>
  );
};

export default ProfileTab;

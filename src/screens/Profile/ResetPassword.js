import React, { useState } from "react";
import { Image, Text, View, TextInput, ScrollView, Alert } from "react-native";
import images from "../../images";
import { Colors, SH, SW, SF } from "../../utils";
import { Modal, Spacing } from "../../components/common";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import apiEndpoint from "../../config/apiConfig";
import { InputTextStyles } from "../../styles/InputTextStyles";
import { TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import {
  PasswordOutlineIcon,
  ActivitiesOutlineIcon,
  SearchOutline,
} from "../../svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { primaryColors } from "../../components/UI/DesignSystem/colorPalette";
import { body } from "../../components/UI/DesignSystem/typography";
import { Button } from "@/components/Button";

const ResetPassword = ({ navigation }) => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const setModalState = (newState) => {
    setModal((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const closeModal = () => {
    navigation.goBack();
    setModal((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const validationSchema = yup.object().shape({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your new password"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiEndpoint}/auth/resetpassword/`,
        {
          old_password: values.currentPassword,
          new_password: values.newPassword,
          confirm_new_password: values.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        setModalState({
          visible: true,
          title: "Success",
          message: response.data.result,
        });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        // No response received
        console.error("Network error:", error.request);
      } else {
        // Something went wrong in setting up the request
        console.error("Request error:", error.message);
      }

      setModalState({
        visible: true,
        title: "Error Resetting Password",
        message:
          error.response?.data?.result ||
          "Failed to reset password. Check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primaryColors.gray[50],
        borderWidth: 0,
        borderColor: Colors.blue_color,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: SW(20) }}
      >
        <View style={{ width: "100%", alignItems: "flex-start" }}>
          <Spacing space={SH(20)} />

          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: SH(0),
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.gray[700],
                  }}
                >
                  Current Password
                </Text>
                <Spacing space={SH(6)} />

                <Input
                  placeholder="Enter your current password"
                  onChangeText={handleChange("currentPassword")}
                  onBlur={handleBlur("currentPassword")}
                  value={values.currentPassword}
                  secureTextEntry={!passwordVisible.currentPassword}
                  style={{ flexGrow: 1 }}
                  inputStyle={{
                    color: Colors.black_text_color,
                    minHeight: SH(20),
                    maxHeight: SH(20),
                    height: "100%",
                    ...body.sm.regular,
                  }}
                  containerStyle={{
                    borderRadius: SW(8),
                    backgroundColor: "white",
                    height: SH(44),
                    paddingHorizontal: 0,
                    flex: 1,
                    flexGrow: 1,
                  }}
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: Colors.gray_line_color,
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                    padding: SW(10),
                    gap: SW(2),
                    borderRadius: SW(8),
                  }}
                  rightIcon={
                    <MaterialCommunityIcons
                      name={passwordVisible.currentPassword ? "eye" : "eye-off"}
                      size={16}
                      color={Colors.black_text_color}
                      onPress={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                    />
                  }
                />
                {touched.currentPassword && errors.currentPassword && (
                  <Text
                    style={{
                      ...body.xs.regular,
                      color: primaryColors.error[400],
                    }}
                  >
                    {errors.currentPassword}
                  </Text>
                )}

                <Spacing space={SH(16)} />

                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.gray[700],
                  }}
                >
                  New Password
                </Text>
                <Spacing space={SH(6)} />

                <Input
                  placeholder="Enter your new password"
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  secureTextEntry={!passwordVisible.newPassword}
                  style={{ flexGrow: 1 }}
                  inputStyle={{
                    color: Colors.black_text_color,
                    minHeight: SH(20),
                    maxHeight: SH(20),
                    height: "100%",
                    ...body.sm.regular,
                  }}
                  containerStyle={{
                    borderRadius: SW(8),
                    backgroundColor: "white",
                    height: SH(44),
                    paddingHorizontal: 0,
                    flex: 1,
                    flexGrow: 1,
                  }}
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: Colors.gray_line_color,
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                    padding: SW(10),
                    gap: SW(2),
                    borderRadius: SW(8),
                  }}
                  rightIcon={
                    <MaterialCommunityIcons
                      name={passwordVisible.newPassword ? "eye" : "eye-off"}
                      size={16}
                      color={Colors.black_text_color}
                      onPress={() => togglePasswordVisibility("newPassword")}
                    />
                  }
                />
                {touched.newPassword && errors.newPassword && (
                  <Text
                    style={{
                      ...body.xs.regular,
                      color: primaryColors.error[400],
                    }}
                  >
                    {errors.newPassword}
                  </Text>
                )}
                <Spacing space={SH(16)} />

                <Text
                  style={{
                    ...body.sm.medium,
                    color: primaryColors.gray[700],
                  }}
                >
                  Confirm New Password
                </Text>
                <Spacing space={SH(6)} />

                <Input
                  placeholder="Confirm your new password"
                  onChangeText={handleChange("confirmNewPassword")}
                  onBlur={handleBlur("confirmNewPassword")}
                  value={values.confirmNewPassword}
                  secureTextEntry={!passwordVisible.confirmNewPassword}
                  style={{ flexGrow: 1 }}
                  inputStyle={{
                    color: Colors.black_text_color,
                    minHeight: SH(20),
                    maxHeight: SH(20),
                    height: "100%",
                    ...body.sm.regular,
                  }}
                  containerStyle={{
                    borderRadius: SW(8),
                    backgroundColor: "white",
                    height: SH(44),
                    paddingHorizontal: 0,
                    flex: 1,
                    flexGrow: 1,
                  }}
                  inputContainerStyle={{
                    borderWidth: 1,
                    borderColor: Colors.gray_line_color,
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                    padding: SW(10),
                    gap: SW(2),
                    borderRadius: SW(8),
                  }}
                  rightIcon={
                    <MaterialCommunityIcons
                      name={
                        passwordVisible.confirmNewPassword ? "eye" : "eye-off"
                      }
                      size={16}
                      color={Colors.black_text_color}
                      onPress={() =>
                        togglePasswordVisibility("confirmNewPassword")
                      }
                    />
                  }
                />
                {touched.confirmNewPassword && errors.confirmNewPassword && (
                  <Text
                    style={{
                      ...body.xs.regular,
                      color: primaryColors.error[400],
                    }}
                  >
                    {errors.confirmNewPassword}
                  </Text>
                )}
                <Spacing space={SH(20)} />

                <Button
                  label="Reset Password"
                  onPress={handleSubmit}
                  loading={loading}
                  style={{ width: "100%" }}
                />
              </View>
            )}
          </Formik>
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
            height: SH(50),
            width: SH(200),
            margin: SH(25),
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: SF(12),
            color: Colors.dark_gray_text_color,
            marginTop: SH(-33),
          }}
        >
          Version 4.0.5
        </Text>
      </View>
      <Modal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        onOkayPress={closeModal}
      />
    </View>
  );
};

export default ResetPassword;

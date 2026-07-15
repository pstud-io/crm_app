import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import apiEndpoint from "../config/apiConfig";
import { api } from "@/api/client";

export const useCustomFieldEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const headers = {
    Authorization: `token ${token}`,
    "X-OrganizationID": organization_id,
    "Content-Type": "application/json",
  };

  // --- CUSTOM FIELDS CONFIGURATION ---

  const createCustomField = async (setLoading, data, onSuccess) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiEndpoint}/customers/custom-fields/`,
        data,
        { headers },
      );
      if (response.status >= 200 && response.status < 300) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Custom field created",
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.result || "Failed to create field",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomFields = async (setLoading, contextType, setData) => {
    setLoading(true);
    try {
      // contextType can be: task, activity, checklist, quote, order, invoice
      const response = await api.get(
        `${apiEndpoint}/customers/custom-fields/?context_type=${contextType}`,
      );
      if (response.status === 200) {
        console.log("This is the custom fields response", response.data.result);
        const allCustomFields = response.data.result;
        const filteredCustomFields = allCustomFields.filter((field) => {
          return field.fk_parent_custom_field === null;
        });
        console.log("This is the filtered custom fields", filteredCustomFields);
        setData(filteredCustomFields);
      }
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomField = async (setLoading, fieldId, data, onSuccess) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiEndpoint}/customers/custom-fields/?custom_field_id=${fieldId}`,
        data,
        { headers },
      );
      if (response.status >= 200 && response.status < 300) {
        Toast.show({
          type: "success",
          text1: "Updated",
          text2: "Field updated successfully",
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.response?.data?.result,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- CUSTOM FIELD VALUES (ITEMS) ---

  const saveCustomFieldItemValue = async (
    setLoading,
    fieldId,
    data,
    onSuccess,
  ) => {
    setLoading(true);
    try {
      // data should contain { value, context_id }
      const response = await api.post(
        `${apiEndpoint}/customers/custom-field-items/?custom_field_id=${fieldId}`,
        data,
      );
      if (response.status >= 200 && response.status < 300) {
        // Toast.show({ type: "success", text1: "Saved", text2: "Value saved successfully" });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.result,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCustomFieldItemValue = async (
    setLoading,
    itemId,
    data,
    onSuccess,
  ) => {
    if (typeof setLoading === "function") setLoading(true);
    try {
      const response = await api.put(
        `${apiEndpoint}/customers/custom-field-items/?custom_field_item_id=${itemId}`,
        data,
      );
      if (response.status >= 200 && response.status < 300) {
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Update item error:", error);
      throw error;
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

  return {
    createCustomField,
    getCustomFields,
    updateCustomField,
    saveCustomFieldItemValue,
    updateCustomFieldItemValue,
  };
};

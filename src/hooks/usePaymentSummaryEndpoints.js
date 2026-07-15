import axios from "axios";
import apiEndpoint from "../config/apiConfig";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export const usePaymentSummaryEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const selectedProject = useSelector((state) => state.project);

  const getOrganizationPaymentSummary = async (
    organizationContactId = null,
  ) => {
    try {
      const params = {};
      if (organizationContactId) {
        params.organization_contact_id = organizationContactId;
      }

      const response = await axios.get(
        `${apiEndpoint}/financials/payment-summary/?organization_contact_id=${organization_contact_id}`,
        {
          params,
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Could not fetch organization payment summary.",
      });
      throw error;
    }
  };

  const getProjectPaymentSummary = async (
    projectId,
    organizationContactId = null,
  ) => {
    try {
      const params = {
        project_id: projectId,
      };

      if (organizationContactId) {
        params.organization_contact_id = organizationContactId;
      }

      const response = await axios.get(
        `${apiEndpoint}/financials/payment-summary/?organization_contact_id=${organization_contact_id}&project_id=${selectedProject.id}`,
        {
          params,
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message ||
          "Could not fetch project payment summary.",
      });
      throw error;
    }
  };

  return { getOrganizationPaymentSummary, getProjectPaymentSummary };
};

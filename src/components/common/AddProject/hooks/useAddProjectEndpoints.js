import apiEndpoint from "../../../../config/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";

export const useAddProjectEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  const getClientsForDropdown = async (
    loading,
    setLoading,
    setClientDetails,
  ) => {
    setLoading({ ...loading, getClientsForDropdown: true });
    // console.log("Token in dropdown", token);
    try {
      const response = await axios.get(`${apiEndpoint}/customers/clients/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // console.log("Client details", response.data.result);
        setClientDetails([...response.data.result]);
      }
    } catch (error) {
      console.error(
        "Error fetching clients:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading({ ...loading, getClientsForDropdown: false });
    }
  };

  return { getClientsForDropdown };
};

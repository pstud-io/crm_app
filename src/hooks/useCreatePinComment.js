import axios from "axios";
import apiEndpoint from "../config/apiConfig";
import { useSelector } from "react-redux";

export const useCreatePinComment = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const project = useSelector((state) => state.project);
  const project_id = project.id;

  const createPinComment = async (
    context_id,
    context_type,
    title,
    x_coordinate,
    y_coordinate,
    setLoading,
  ) => {
    setLoading((prev) => ({ ...prev, creatingPinComment: true }));
    const payload = {
      context_id: context_id,
      context_type: context_type,
      title: title || null,
      x_coordinate: x_coordinate,
      y_coordinate: y_coordinate,
    };

    console.log("Payload in useCreatePinComment is", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/moodboards/pin-comment-chain/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response of create pin comment", response.data.result);
        return response.data.result;
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error:", error.message);
      }

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "An error occurred while marking task as complete.",
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 30,
      });
    } finally {
      setLoading((prev) => ({ ...prev, creatingPinComment: false }));
    }
  };

  return { createPinComment };
};

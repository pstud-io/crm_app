import { useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useState } from "react";
export const useGetComment = ({ setCommentsData, commentGetURL }) => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const [loadingGetComments, setLoadingGetComments] = useState(false);
  const getComments = async () => {
    setLoadingGetComments(true);

    try {
      const response = await axios.get(commentGetURL, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // console.log("Fetched comments:", response.data.result[0].comments[0]);
        setCommentsData(response.data.result);
      }
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Request error in getComments:", error.message);
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch comments. Check your network connection.",
        visibilityTime: 1000,
        autoHide: true,
      });
    } finally {
      setLoadingGetComments(false);
    }
  };

  return { getComments, loadingGetComments };
};

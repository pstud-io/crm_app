import { useSelector } from "react-redux";
import apiEndpoint from "../../../config/apiConfig";
import axios from "axios";
import Toast from "react-native-toast-message";

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =========================================================================
// Hook for Leave Module Endpoints
// =========================================================================

export const useLeaveEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const organization_id = useSelector((state) => state.profile.organization_id);

  // --- GET All User Leaves ---
  const getUserLeaves = async (setLoading, setLeavesData) => {
    setLoading(true);

    try {
      const response = await axios.get(`${apiEndpoint}/manpower/user-leaves/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("User leaves response:", response.data.result);
        setLeavesData(response.data.result);
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
        text1: "Error",
        text2: error.response?.data?.result || "Failed to fetch user leaves.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- POST Add New Leave Request ---
  const handleAddLeave = async (
    setLoading,
    startDate,
    endDate,
    title,
    type,
    dayLength,
    description,
    onSuccess // Callback to refresh data or close modal
  ) => {
    setLoading((prev) => ({ ...prev, addLeave: true }));

    if (!startDate || !endDate || !title || !type || !dayLength) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all required fields (Dates, Title, Type, Length).",
      });
      setLoading((prev) => ({ ...prev, addLeave: false }));
      return;
    }

    try {
      const payload = {
        day_length: dayLength, // 'full_day' or 'half_day'
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        title: title,
        type: type, // 'sick' or 'casual'
        description: description,
      };

      console.log("Add Leave Payload:", payload);

      const response = await axios.post(
        `${apiEndpoint}/manpower/user-leaves/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Add Leave Response:", response.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Leave request submitted successfully.",
        });
        onSuccess && onSuccess();
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
        text1: "Error",
        text2:
          error.response?.data?.result || "Failed to submit leave request.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, addLeave: false }));
    }
  };

  // --- PUT Update Leave Status (e.g., for cancellation/approval) ---
  const updateLeaveStatus = async (
    setLoading,
    userLeaveId,
    newStatus,
    onSuccess
  ) => {
    setLoading(true);

    try {
      const payload = {
        status: newStatus,
        is_active: false,
      };

      const response = await axios.put(
        `${apiEndpoint}/manpower/user-leaves/?user_leave_id=${userLeaveId}`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Update Leave Response:", response.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Leave status updated to ${newStatus}.`,
        });
        onSuccess && onSuccess();
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
        text1: "Error",
        text2: error.response?.data?.result || "Failed to update leave status.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- GET Leave Summary ---
  const getLeaveSummary = async (componentSetLoading, setSummaryData) => {
    componentSetLoading(true);

    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/leave-summary/`,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Leave Summary response:", response.data.result);
        setSummaryData(response.data.result);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.result;

      if (errorMessage === "CompanyLeaves matching query does not exist.") {
        console.warn(
          "Leave Summary not initialized. Please run the PUT request to initialize data."
        );
        setSummaryData(null);
      } else {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Network error:", error.request);
        } else {
          console.error("Request error:", error.message);
        }
        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage || "Failed to fetch leave summary.",
        });
      }
    } finally {
      componentSetLoading(false);
    }
  };

  // --- PUT Update Leave Summary (Company/Admin use case) ---
  const updateLeaveSummary = async (
    setLoading,
    totalLeaves,
    sickLeaves,
    casualLeaves,
    paidLeaves,
    onSuccess
  ) => {
    setLoading((prev) => ({ ...prev, updateLeaveSummary: true }));

    try {
      const payload = {
        total_leaves: totalLeaves,
        sick_leaves: sickLeaves,
        casual_leaves: casualLeaves,
        paid_leaves: paidLeaves,
      };

      const response = await axios.put(
        `${apiEndpoint}/manpower/leave-summary/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Update Leave Summary Response:", response.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Leave summary settings updated.",
        });
        onSuccess && onSuccess();
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
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to update leave summary settings.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, updateLeaveSummary: false }));
    }
  };

  return {
    getUserLeaves,
    handleAddLeave,
    updateLeaveStatus,
    getLeaveSummary,
    updateLeaveSummary,
  };
};

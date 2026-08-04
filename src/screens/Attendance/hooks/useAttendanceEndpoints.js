import Toast from "react-native-toast-message";
import apiEndpoint from "../../../config/apiConfig";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Location from "expo-location";
import {
  closePunchOutBottomSheet,
  closeRegularizationBottomSheet,
} from "../utils/attendance/punchoutBottomSheetService";
import { Colors, formatTimeHHMM } from "../../../utils";
import { Alert, Linking } from "react-native";
import { useGeneralEndpoints } from "../../../hooks/useGeneralEndpoints";

export const useAttendanceEndpoints = () => {
  const token = useSelector((state) => state.auth.token);
  const project = useSelector((state) => state.project.selectedProject);
  const organization_id = useSelector((state) => state.profile.organization_id);
  const organization_contact_id = useSelector(
    (state) => state.profile.organization_contact_id,
  );
  const { uploadMedia } = useGeneralEndpoints();
  const getAttendance = async (setLoading, setAttendanceData, month, year) => {
    setLoading((prev) => ({ ...prev, getAttendance: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/user-attendance-summary/?month=${month}&year=${year}`,
        {
          headers: {
            Accept: "application/json", // Added valid Accept header
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response data for Attendance:", response.data.result);
        setAttendanceData(response.data.result);
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
          "Failed to fetch attendance data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getAttendance: false }));
    }
  };

  const getAttendanceSummary = async (
    setLoading,
    setAttendanceSummaryData,
    month,
    year,
  ) => {
    setLoading((prev) => ({ ...prev, getAttendanceSummary: true }));

    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/attendance-summary/?month=${month}&year=${year}`,
        {
          headers: {
            Accept: "application/json", // Added valid Accept header
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "Response data for Attendance Summary:",
          response.data.result,
        );
        setAttendanceSummaryData(response.data.result);
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
          "Failed to fetch attendance summary. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getAttendanceSummary: false }));
    }
  };

  const fetchLocation = async (setLoading = () => {}) => {
    setLoading((prev) => ({ ...prev, loadingText: "Fetching location..." }));
    console.log("In fetch location");
    try {
      let { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status === "denied" && !canAskAgain) {
        Alert.alert(
          "Location Permission Permanently Denied",
          "Please go to your device settings to enable location permissions for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        setLoading((prev) => ({ ...prev, loadingText: "" }));
        return { granted: false, coords: null };
      }

      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location status Error",
          text2: "Permission to access location was denied.",
        });
        setLoading((prev) => ({ ...prev, loadingText: "" }));
        return { granted: false, coords: null };
      }

      console.log("This is before isLocationEnabled");
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      console.log("This is isLocationEnabled", isLocationEnabled);
      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        setLoading((prev) => ({ ...prev, loadingText: "" }));
        return { granted: false, coords: null };
      }
      console.log("This is before get current position");
      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log("Locatmion cords", coords);
      setLoading((prev) => ({ ...prev, loadingText: "Marking attendance..." }));
      return { granted: true, coords };
    } catch (error) {
      // console.error(error);
      console.log("Code:", error.code);
      console.log("Message:", error.message);
      console.log("Error:", JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2:
          error?.response?.data?.result ||
          "Failed to fetch location. Please try again.",
      });
      setLoading((prev) => ({ ...prev, loadingText: "" }));
      return { granted: false, coords: null };
    }
  };

  const handlePunchInPress = async (
    setLoading,
    selectedMedia,
    refreshAttendanceData,
  ) => {
    console.log("In Punch In Press before setLoading");
    let assetID = "";
    setLoading((prev) => ({ ...prev, markingAttendance: true }));
    console.log("In Punch In Press after setLoading");

    const LOCATION_TIMEOUT = 20000;
    const locationStatus = await Promise.race([
      fetchLocation(setLoading),
      new Promise((_, reject) =>
        setTimeout(() => {
          reject(new Error("LOCATION_TIMEOUT"));
        }, LOCATION_TIMEOUT),
      ),
    ]).catch((error) => {
      if (error.message === "LOCATION_TIMEOUT") {
        Alert.alert(
          "Location Unavailable",
          "Unable to fetch your location. Please move to an area with a better GPS signal and try again.",
        );
        return null;
      }

      throw error; // Let actual errors bubble up
    });

    console.log("In Punch In Press after fetchLocation");
    if (!locationStatus.granted) {
      console.log("Punch In canceled due to denied location permission.");
      setLoading((prev) => ({ ...prev, markingAttendance: false }));
      return; // Exit if location permission is denied
    }
    console.log("After location fetched");
    const { coords } = locationStatus;

    if (!coords) {
      console.error("Location coordinates are null.");
      setLoading((prev) => ({ ...prev, loadingText: "" }));
      setLoading((prev) => ({ ...prev, markingAttendance: false }));
      return;
    }

    console.log("Current Location:", coords);

    if (selectedMedia.length > 0) {
      try {
        setLoading((prev) => ({ ...prev, loadingText: "Uploading media..." }));
        const assetResponse = await uploadMedia(selectedMedia, project.id);
        setLoading((prev) => ({
          ...prev,
          loadingText: "Marking attendance...",
        }));

        console.log("This is the asset response", assetResponse);
        assetID = assetResponse.data.result[0].id;
      } catch (error) {
        console.error("Selfie Upload failed:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Selfie Upload Failed",
          visibilityTime: 1000,
          autoHide: true,
        });
        setLoading((prev) => ({ ...prev, loadingText: "" }));
        return;
      }
    }
    const payload = {
      fk_organization_contact: organization_contact_id,
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      type: "in",
      self_asset: assetID,
    };
    console.log("this is the payload of punch in", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/manpower/organizationmanpower/`,
        [payload],
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Punch In response:", response.data);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Successfully Punched In",
          visibilityTime: 1000,
          autoHide: true,
          position: "top",
        });
        await refreshAttendanceData();
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
          "Failed to mark attendance. Check your network connection.",
        visibilityTime: 1000,
        autoHide: true,
        position: "top",
        text1Style: { color: Colors.red },
        text2Style: { fontSize: 14, color: Colors.black_text_color },
      });
    } finally {
      setLoading((prev) => ({ ...prev, loadingText: "" }));
      setLoading((prev) => ({ ...prev, markingAttendance: false }));
    }
  };

  const handlePunchOutPress = async (
    setLoading,
    refreshAttendanceData,
    note,
    selectedMedia,
  ) => {
    console.log("In handle punch out");
    let assetID = "";
    setLoading((prev) => ({ ...prev, markingAttendance: true }));
    console.log("In handle punch out after setLoading");

    const LOCATION_TIMEOUT = 10000;

    const locationStatus = await Promise.race([
      fetchLocation(setLoading),
      new Promise((_, reject) =>
        setTimeout(() => {
          reject(new Error("LOCATION_TIMEOUT"));
        }, LOCATION_TIMEOUT),
      ),
    ]).catch((error) => {
      if (error.message === "LOCATION_TIMEOUT") {
        Alert.alert(
          "Location Unavailable",
          "Unable to fetch your location. Please move to an area with a better GPS signal and try again.",
        );
        return null;
      }

      throw error; // Let actual errors bubble up
    });

    console.log("In punchout press after fetch location");
    if (!locationStatus.granted) {
      console.log("Punch Out canceled due to denied location permission.");
      setLoading((prev) => ({ ...prev, markingAttendance: false }));

      return; // Exit if location permission is denied
    }

    const { coords } = locationStatus;

    if (!coords) {
      console.error("Location coordinates are null.");
      setLoading((prev) => ({ ...prev, markingAttendance: false }));

      return;
    }

    console.log("Current Location:", coords);

    if (selectedMedia.length > 0) {
      try {
        setLoading((prev) => ({ ...prev, loadingText: "Uploading media..." }));

        const assetResponse = await uploadMedia(selectedMedia, project.id);
        setLoading((prev) => ({
          ...prev,
          loadingText: "Marking attendance...",
        }));
        console.log("This is the asset response", assetResponse);
        assetID = assetResponse.data.result[0].id;
      } catch (error) {
        console.error("Selfie Upload failed:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Selfie Upload Failed",
          visibilityTime: 1000,
          autoHide: true,
        });
        return;
      }
    }

    const payload = {
      fk_organization_contact: organization_contact_id,
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      type: "out",
      remarks: note,
      self_asset: assetID,
    };
    console.log("Payload of punchout press", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/manpower/organizationmanpower/`,
        [payload],
        {
          headers: {
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Successfully Punched Out",
          visibilityTime: 1000,
          autoHide: true,
          position: "top",
        });
      }
      closePunchOutBottomSheet();
      await refreshAttendanceData();
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
          "Failed to mark attendance. Check your network connection.",
        visibilityTime: 1000,
        autoHide: true,
        position: "top",
        text1Style: { color: Colors.red, fontFamily: "Inter-SemiBold" },
        text2Style: {
          fontSize: 14,
          color: Colors.black_text_color,
          fontFamily: "Inter-Regular",
        },
      });
    } finally {
      setLoading((prev) => ({ ...prev, markingAttendance: false }));
    }
  };

  const handleRegularlizationRequest = async (
    setLoading,
    refreshAttendanceData,
    punch_in_time,
    punch_out_time,
    date,
    remarks,
  ) => {
    console.log("Requesting regularization");
    setLoading(true);
    const payload = {
      date: date,
      punch_in_time: formatTimeHHMM(punch_in_time),
      punch_out_time: formatTimeHHMM(punch_out_time),
      remarks: remarks,
    };
    console.log("Payload in regularization request", payload);
    try {
      const response = await axios.post(
        `${apiEndpoint}/manpower/regularization-request/`,
        payload,
        {
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        closeRegularizationBottomSheet();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Request sent successfully",
          visibilityTime: 1000,
          autoHide: true,
        });
        await refreshAttendanceData();
      }
    } catch (error) {
      console.error("Rename API Error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send request",
        visibilityTime: 1000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRequests = async (setLoading, setRequestsData) => {
    setLoading((prev) => ({ ...prev, getRequests: true }));

    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/regularization-request/`,
        {
          headers: {
            "Content-Type": "application/json", // Added valid Accept header
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response data for Requests:", response.data.result);

        const firstAttendance = response.data.result?.[0];
        // if (firstAttendance) {
        //   console.log("First Attendance Type:", firstAttendance.type);
        //   setIsPunchedIn(firstAttendance.type === "in");
        //   setLastPunch({
        //     time: formatDateTime(firstAttendance.created_on).split(" ")[1], // Extract time
        //     date: formatDateTime(firstAttendance.created_on).split(" ")[0], // Extract date
        //   });
        // }
        setRequestsData(response.data.result);
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
          "Failed to fetch requests. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getRequests: false }));
    }
  };

  const getCustomWeekends = async (setLoading, setWeekendsData) => {
    setLoading((prev) => ({ ...prev, getCustomWeekends: true }));
    try {
      const response = await axios.get(
        `${apiEndpoint}/manpower/custom-weekends/`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `token ${token}`,
            "X-OrganizationID": organization_id,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Response data for Custom Weekends:", response.data.result);
        setWeekendsData(response.data.result);
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
          "Failed to fetch custom weenkends data. Check your network connection.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, getCustomWeekends: false }));
    }
  };

  return {
    getAttendance,
    getAttendanceSummary,
    handlePunchInPress,
    handlePunchOutPress,
    handleRegularlizationRequest,
    getRequests,
    fetchLocation,
    getCustomWeekends,
  };
};

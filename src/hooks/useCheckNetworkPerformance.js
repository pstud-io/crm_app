import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { setSyncDataCheckGlobal } from "../store/slices/syncDataCheckGlobal";
import apiEndpoint from "../config/apiConfig";
import axios from "axios";
import { setNetworkCheckGlobal } from "../store/slices/networkCheckGlobal";

export const useCheckNetworkPerformance = () => {
  const [latency, setLatency] = useState(null);
  const [isSlow, setIsSlow] = useState(false);
  const dispatch = useDispatch();
  const addToSyncQueue = async (module, payload) => {
    try {
      const existingData = await AsyncStorage.getItem("sync");

      const syncData = existingData
        ? JSON.parse(existingData)
        : {
            quickUpdate: [],
            activity: [],
            attendance: [],
            checklists: [],
            comments: [],
            manpower: [],
            edit_manpower: [],
            note: [],
          };

      syncData[module] = [...(syncData[module] || []), payload];

      await AsyncStorage.setItem("sync", JSON.stringify(syncData));
      console.log("Saved to async storage", syncData);
      Toast.show({
        type: "info",
        text1: "Added to sync",
        text2: "Data will be uploaded when network is good",
      });
      const totalCount = Object.values(syncData).reduce(
        (total, items) => total + items.length,
        0,
      );
      console.log("Count is", totalCount);
      dispatch(
        setSyncDataCheckGlobal({
          hasData: true,
          count: totalCount,
        }),
      );
    } catch (error) {
      console.error("Failed to update sync queue", error);
    }
  };
  const networkCheckGlobal = useSelector(
    (state) => state.networkCheckGlobal.networkCheckGlobal,
  );

  const checkNetworkSpeed = async () => {
    console.log("Before response of check network speed");
    const start = global.performance.now();
    try {
      const response = await axios.get(`${apiEndpoint}/core/latency/`, {
        headers: {
          "X-ORG-SIGNUP-XYZ": "yoyo-123-sec-xyz-ret",
        },
      });
      const latency = global.performance.now() - start;
      let isNetworkSlow = false;
      console.log("The latency is", latency);
      setLatency(latency);
      if (latency > 1000) {
        if (!isSlow) {
          setIsSlow(true);
        }
        isNetworkSlow = true;
        if (!networkCheckGlobal?.isSlow) {
          console.log("before use dispatck ");
          dispatch(
            setNetworkCheckGlobal({
              isSlow: true,
              latency,
            }),
          );
          console.log("after use dispatck ");
        }
      } else {
        if (isSlow) {
          setIsSlow(false);
        }
        isNetworkSlow = false;
        if (networkCheckGlobal?.isSlow) {
          console.log("before use dispatck ");
          dispatch(
            setNetworkCheckGlobal({
              isSlow: false,
              latency,
            }),
          );
          console.log("after use dispatck ");
        }
      }
      return { latency, isSlow: isNetworkSlow };
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
          "Failed to check network speed. Check your network connection.",
      });
      return null;
    }
  };

  return {
    latency,
    setLatency,
    checkNetworkSpeed,
    addToSyncQueue,
    isSlow,
    setIsSlow,
  };
};

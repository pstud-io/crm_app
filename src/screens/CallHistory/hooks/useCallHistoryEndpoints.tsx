import { useState } from "react";
import {
  addCallHistory,
  CallHistoryExtraParams,
  fetchCallHistory,
} from "../utils/callHistoryEndpoints";
import Toast from "react-native-toast-message";
import { GetDataProps } from "@/hooks/usePaginatedSearch";

export const useCallHistoryEndpoints = () => {
  const [callHistoryLoading, setCallHistoryLoading] = useState({
    getCallHistory: false,
    postCallHistory: false,
  });

  const getCallHistory = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
    ...callHistoryExtraParams
  }: GetDataProps<any> & CallHistoryExtraParams) => {
    if (!hasMore && page !== 1) return;
    console.log("before set loading");
    setCallHistoryLoading((prev: any) => ({ ...prev, getCallHistory: true }));
    console.log("After set loading of kanban");
    try {
      const response = await fetchCallHistory(
        page,
        searchTerm,
        pageSize,
        abortSignal,
        callHistoryExtraParams,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allData = response.data.results;

        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(() => updatedData);
        const hasMore = response.data.next !== null;

        return { hasMore };
      }
    } catch (error: any) {
      console.error("Error loading call history:", error);

      Toast.show({
        type: "error",
        text1: "Error Loading Call History",
        text2:
          error.response?.data?.result ||
          "Failed to fetch call history data. Check your network connection.",
      });
    } finally {
      setCallHistoryLoading((prev: any) => ({
        ...prev,
        getCallHistory: false,
      }));
    }
  };
  const postCallHistory = async (externalPayload: any) => {
    console.log("Adding call history", externalPayload);
    setCallHistoryLoading((prev) => ({ ...prev, postCallHistory: true }));
    try {
      await addCallHistory(externalPayload);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error Occured",
        text2: error.response?.data || error.message,
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setCallHistoryLoading((prev) => ({ ...prev, postCallHistory: false }));
    }
  };
  return { callHistoryLoading, postCallHistory, getCallHistory };
};

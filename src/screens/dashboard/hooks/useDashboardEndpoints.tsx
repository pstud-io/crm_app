import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GetDataProps } from "@/hooks/usePaginatedSearch";
import { fetchAllData } from "@/screens/Leads/utils/leadsEndpoints";

export const useDashboardEndpoints = () => {
  const [dashboardLoading, setDashboardLoading] = useState({
    getAllData: false,
  });

  const getAllData = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
  }: GetDataProps<any>) => {
    if (!hasMore && page !== 1) return;
    console.log("before set loading");
    setDashboardLoading((prev: any) => ({ ...prev, getAllData: true }));
    console.log("After set loading of kanban");
    try {
      const response = await fetchAllData(
        page,
        searchTerm,
        pageSize,
        abortSignal,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allData = response.data.result.results;
        console.log("All data is", allData);
        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(updatedData);
        const hasMore = response.data.next !== null;
        return { hasMore };
      }
    } catch (error: any) {
      console.error("Error loading tasks:", error);
      if (error.response?.data?.result === "Invalid page.") {
        return { hasMore: false };
      } else {
        Toast.show({
          type: "error",
          text1: "Error Loading Kanban",
          text2:
            error.response?.data?.result ||
            "Failed to fetch tasks data. Check your network connection.",
        });
      }
    } finally {
      setDashboardLoading((prev: any) => ({ ...prev, getAllData: false }));
    }
  };
  return {
    dashboardLoading,
    getAllData,
  };
};

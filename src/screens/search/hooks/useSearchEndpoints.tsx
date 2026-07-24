import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { GetDataProps } from "@/hooks/usePaginatedSearch";
import { fetchAllData } from "@/screens/Leads/utils/leadsEndpoints";
import { SearchSectionState } from "../types/searchTypes";

export const useSearchEndpoints = () => {
  const [searchLoading, setSearchLoading] = useState({
    getAllData: false,
  });

  const updateSection = (
    prev: SearchSectionState,
    response: {
      results: any[];
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      has_next: boolean;
    },
  ): SearchSectionState => ({
    data:
      response.page === 1
        ? response.results
        : [...prev.data, ...response.results],
    count: response.count,
    page: response.page,
    pageSize: response.page_size,
    totalPages: response.total_pages,
    hasNext: response.has_next,
    loading: false,
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
    setSearchLoading((prev: any) => ({ ...prev, getAllData: true }));
    console.log("After set loading of kanban");
    try {
      const response = await fetchAllData(
        page,
        searchTerm,
        pageSize,
        abortSignal,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allData = response.data.result;
        console.log("All data is", allData);
        const updatedData =
          page === 1
            ? Object.fromEntries(
                Object.entries(allData).map(([key, value]: any) => [
                  key,
                  {
                    ...value,
                    data: value.results,
                    hasNext: value.has_next,
                  },
                ]),
              )
            : Object.fromEntries(
                Object.entries(allData).map(([key, value]: any) => [
                  key,
                  {
                    ...data[key],
                    data: [...data[key].data, ...value.results],
                    hasNext: value.has_next,
                  },
                ]),
              );

        setData(updatedData);

        const hasMore = Object.values(allData).some(
          (module: any) => module.has_next,
        );
        console.log("updated data is", updatedData);
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
      setSearchLoading((prev: any) => ({ ...prev, getAllData: false }));
    }
  };
  return {
    searchLoading,
    getAllData,
  };
};

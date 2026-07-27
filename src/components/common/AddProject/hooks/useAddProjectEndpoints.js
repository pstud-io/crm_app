import { useState } from "react";
import {
  fetchAllAdditionalFields,
  fetchAllClients,
} from "../utils/addProjectEndpoints";
export const useAddProjectEndpoints = () => {
  const [addProjectLoading, setAddProjectLoading] = useState({
    getClientsForDropdown: false,
    getAllAdditionalFields: false,
  });
  const getClientsForDropdown = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
  }) => {
    if (!hasMore && page !== 1) return;
    console.log("before set loading");
    setAddProjectLoading((prev) => ({ ...prev, getClientsForDropdown: true }));
    console.log("After set loading of get clients");
    try {
      const response = await fetchAllClients(
        page,
        searchTerm,
        pageSize,
        abortSignal,
      );

      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.results;
        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(() => updatedData);
        const hasMore = response.data.next !== null;
        return { hasMore };
      }
    } catch (error) {
      console.error(
        "Error fetching clients:",
        error.response?.data || error.message,
      );
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getClientsForDropdown: false,
      }));
    }
  };

  const getAllAdditionalFields = async (setAdditionalFields) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllAdditionalFields: true }));
    try {
      const response = await fetchAllAdditionalFields();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setAdditionalFields(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllAdditionalFields: false,
      }));
    }
  };

  return { getClientsForDropdown, addProjectLoading, getAllAdditionalFields };
};

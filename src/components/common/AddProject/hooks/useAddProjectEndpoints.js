import { useState } from "react";
import {
  fetchAllAdditionalFields,
  fetchAllClients,
  fetchAssignees,
  fetchBrands,
  fetchClients,
  fetchLeadSource,
  fetchProjectTypes,
  fetchStages,
} from "../utils/addProjectEndpoints";
export const useAddProjectEndpoints = () => {
  const [addProjectLoading, setAddProjectLoading] = useState({
    getClientsForDropdown: false,
    getAllAdditionalFields: false,
    getAllBrands: false,
    getAllProjectTypes: false,
    getAllLeadSource: false,
    getAllClients: false,
    getAllStages: false,
    getAllAssignees: false,
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

  const getAllBrands = async (setBrands) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllBrands: true }));
    try {
      const response = await fetchBrands();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setBrands(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllBrands: false,
      }));
    }
  };
  const getAllProjectTypes = async (setProjectTypes) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllProjectTypes: true }));
    try {
      const response = await fetchProjectTypes();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setProjectTypes(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllProjectTypes: false,
      }));
    }
  };
  const getAllLeadSource = async (setProjectLeadSource) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllLeadSource: true }));
    try {
      const response = await fetchLeadSource();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setProjectLeadSource(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllLeadSource: false,
      }));
    }
  };
  const getAllClients = async (setClients) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllClients: true }));
    try {
      const response = await fetchClients();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setClients(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllClients: false,
      }));
    }
  };
  const getAllStages = async (setStages) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllStages: true }));
    try {
      const response = await fetchStages();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setStages(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllStages: false,
      }));
    }
  };
  const getAllAssignees = async (setAssignees) => {
    setAddProjectLoading((prev) => ({ ...prev, getAllAssignees: true }));
    try {
      const response = await fetchAssignees();
      if (response?.status >= 200 && response?.status < 300) {
        const allData = response.data.result;
        setAssignees(() => allData);
      }
    } catch (error) {
    } finally {
      setAddProjectLoading((prev) => ({
        ...prev,
        getAllAssignees: false,
      }));
    }
  };

  return {
    getClientsForDropdown,
    addProjectLoading,
    getAllAdditionalFields,
    getAllBrands,
    getAllProjectTypes,
    getAllLeadSource,
    getAllClients,
    getAllStages,
    getAllAssignees,
  };
};

import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { GetDataProps } from "@/hooks/usePaginatedSearch";
import { fetchKanban, fetchLeads } from "../utils/leadsEndpoints";
import { KanbanRequestPayload, LeadsRequestPayload } from "../types/leadsTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export interface KanbanExtraParams extends KanbanRequestPayload {}
export interface LeadsExtraParams extends LeadsRequestPayload {}

export const kanbanExtraParams: KanbanExtraParams = {
  limit: 6,
  page_size: 6,
  search: "",
  city: "",
  client_phone: "",
  client_email: "",
  budget: "",
  start_date: null,
  end_date: null,
  additional_fields: [],
  field_search: [],
  include_contacts: true,
  organization_contact_id: "",
  main_stage_id: "",
};

export const leadsExtraParams: LeadsExtraParams = {
  limit: 6,
  page_size: 6,
  search: "",
  city: "",
  client_phone: "",
  client_email: "",
  budget: "",
  start_date: null,
  end_date: null,
  additional_fields: [],
  field_search: [],
  include_contacts: true,
  substage_id: "",
  main_stage_id: null,
  organization_contact_id: "",
};

export const useLeadsEndpoints = () => {
  const [kanbanLoading, setKanbanLoading] = useState({
    getKanban: false,
  });

  const [leadsLoading, setLeadsLoading] = useState({
    getLeads: false,
  });

  const getKanban = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
    ...kanbanExtraParams
  }: GetDataProps<any> & KanbanExtraParams) => {
    if (!hasMore && page !== 1) return;
    console.log("before set loading");
    setKanbanLoading((prev: any) => ({ ...prev, getKanban: true }));
    console.log("After set loading of kanban");
    try {
      const response = await fetchKanban(
        page,
        searchTerm,
        pageSize,
        abortSignal,
        kanbanExtraParams,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allData = response.data.results.substages;

        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(updatedData);
        const hasMore = response.data.next !== null;

        return { hasMore };
      }
    } catch (error: any) {
      console.error("Error loading tasks:", error);

      Toast.show({
        type: "error",
        text1: "Error Loading Kanban",
        text2:
          error.response?.data?.result ||
          "Failed to fetch tasks data. Check your network connection.",
      });
    } finally {
      setKanbanLoading((prev: any) => ({ ...prev, getKanban: false }));
    }
  };

  const getLeads = async ({
    page,
    searchTerm,
    hasMore,
    data,
    setData,
    abortSignal,
    pageSize,
    ...leadsExtraParams
  }: GetDataProps<any> & LeadsExtraParams) => {
    if (!hasMore && page !== 1) return;

    setLeadsLoading((prev: any) => ({ ...prev, getLeads: true }));
    try {
      const response = await fetchLeads(
        page,
        searchTerm,
        pageSize,
        abortSignal,
        leadsExtraParams,
      );
      if (response && response.status >= 200 && response.status < 300) {
        const allData = response?.data?.results || [];
        console.log("All data", allData);
        console.log("Data is", data);
        const updatedData = page === 1 ? allData : [...data, ...allData];
        setData(updatedData);
        const hasMore = response.data.next !== null;
        console.log("has more", hasMore);
        return { hasMore };
      }
    } catch (error: any) {
      console.error("Error loading Leads:", error);

      Toast.show({
        type: "error",
        text1: "Error Loading Kanban",
        text2:
          error.response?.data?.result ||
          "Failed to fetch tasks data. Check your network connection.",
      });
    } finally {
      setLeadsLoading((prev: any) => ({ ...prev, getLeads: false }));
    }
  };

  return { getKanban, kanbanLoading, getLeads, leadsLoading };
};

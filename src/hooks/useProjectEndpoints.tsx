import { apiEndpoint } from "@/api/client";
import { setSelectedProject } from "@/store/slices/projectSlice/projectSlice";
import { ProjectRecord } from "@/store/slices/projectSlice/projectSliceTypes";
import { RootState } from "@/store/store";
import { fetchProjects } from "@/utils/generaEndpoints";
import axios from "axios";
import React, { Dispatch, Ref, SetStateAction, useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { GetDataProps } from "./usePaginatedSearch";

export const useProjectEndpoints = () => {
  const [generalLoading, setGeneralLoading] = useState({
    getProjects: false,
  });
  const dispatch = useDispatch();
  const selectedProject = useSelector((state: RootState) => state.project);

  const getOrganizationDetails = async (
    setLoading: Dispatch<SetStateAction<any>>,
    setOrganizationDetails: Dispatch<SetStateAction<any>>,
    token: string,
    organization_id: string,
  ) => {
    setLoading((prev: any) => ({ ...prev, getOrganizationDetails: true }));
    try {
      const response = await axios.get(`${apiEndpoint}/core/organization/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organization_id,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(
          "get organization details response: ",
          response.data.result,
        );
        setOrganizationDetails(response.data.result);
      }
      return response.data.result;
    } catch (error: any) {
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
          "Failed to fetch organization detials. Check your network connection.",
      });
    } finally {
      setLoading((prev: any) => ({ ...prev, getOrganizationDetails: false }));
    }
  };

  const getOrganizationPermissions = async (
    setLoading: Dispatch<SetStateAction<boolean>> | (() => void),
    token: string,
    organizationID: string,
  ) => {
    setLoading((prev: any) => ({ ...prev, fetchingPermissions: true }));
    console.log("Token in getorganization permissions", token);
    console.log(
      "organization id in getorganization permissions",
      organizationID,
    );
    try {
      const response = await axios.get(`${apiEndpoint}/core/organization/`, {
        headers: {
          Authorization: `token ${token}`,
          "X-OrganizationID": organizationID,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Permissions Response", response.data.result);
        return response.data.result;
      }
    } catch (error: any) {
      console.error(
        "Error fetching Permissions:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.result ||
          "Failed to fetch permissions data. Check your network connection.",
      });
    } finally {
      setLoading((prev: any) => ({ ...prev, fetchingPermissions: false }));
    }
  };

  const getProjects = async ({
    data,
    setData,
    page,
    hasMore,
    searchTerm,
    abortSignal,
    pageSize,
  }: GetDataProps<ProjectRecord>): Promise<
    Record<"hasMore", boolean> | undefined
  > => {
    if (!hasMore && page !== 1) {
      return { hasMore: false };
    }
    setGeneralLoading((prev) => ({ ...prev, getProjects: true }));
    const initialProject = { id: "all_projects", project_name: "All Leads" };

    try {
      const response = await fetchProjects(
        page,
        searchTerm,
        pageSize,
        abortSignal,
      );

      if (response && response.status >= 200 && response.status < 300) {
        const titles: ProjectRecord[] = response.data.results.map(
          (project: any): ProjectRecord => ({
            project_name: project.project_name,
            id: project.id,
          }),
        );

        const updatedProjects: ProjectRecord[] =
          page === 1 ? [initialProject, ...titles] : [...data, ...titles];

        setData(updatedProjects);
        const hasMore = response.data.next !== null;

        if (!selectedProject.id && titles.length > 0) {
          console.log("In correct if");
          dispatch(setSelectedProject(titles[0]));
        } else if (!selectedProject.id && titles.length === 0) {
          dispatch(setSelectedProject(initialProject));
        }

        return { hasMore: hasMore };
      }
    } catch (e) {
      console.log("Logging from general endpoints", e);
    } finally {
      setGeneralLoading((prev) => ({ ...prev, getProjects: false }));
    }
  };

  return {
    getOrganizationDetails,
    getOrganizationPermissions,
    getProjects,
    generalLoading,
  };
};

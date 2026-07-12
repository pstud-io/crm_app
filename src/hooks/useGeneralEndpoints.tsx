import { apiEndpoint } from "@/api/client";
import { setSelectedProject } from "@/store/slices/projectSlice";
import { fetchProjects } from "@/utils/generaEndpoints";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export const useGeneralEndpoints = () => {
  const [generalLoading, setGeneralLoading] = useState({
    getProjects: false,
  });
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);
  const profile = useSelector((state: any) => state.profile);
  const organization_id = useSelector(
    (state: any) => state.profile.organization_id,
  );
  const organization_contact_id = useSelector(
    (state: any) => state.profile.organization_contact_id,
  );
  const selectedProject = useSelector(
    (state: any) => state.project.selectedProject,
  );
  console.log("This is the profile id", profile);
  console.log(
    "this is the selected poroject in useGeneralEndpoints",
    selectedProject,
  );

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

  const getProjects = async (
    projectsData: any[],
    setProjects: Dispatch<SetStateAction<any>>,
    page: number,
    hasMore: boolean,
    searchTerm: string,
    pageSize: number = 25,
  ) => {
    if (!hasMore && page !== 1) return;
    setGeneralLoading((prev) => ({ ...prev, getProjects: true }));
    const initialProject = { id: "all_projects", project_name: "All Projects" };

    try {
      const response = await fetchProjects(
        page,
        searchTerm,
        organization_contact_id,
        token,
        organization_id,
        pageSize,
      );
      if (response.status >= 200 && response.status < 300) {
        console.log("Projects fetched successfully:", response.data);
        const titles = response.data.results.map((project: any) => ({
          project_name: project.project_name,
          id: project.id,
          // client_details: project.client_details,
        }));

        const updatedProjects =
          page === 1
            ? [initialProject, ...titles]
            : [...projectsData, ...titles];
        setProjects(updatedProjects);
        const hasMore = response.data.next !== null;
        if (!selectedProject && titles.length > 0) {
          dispatch(setSelectedProject(titles[0]));
        } else if (!selectedProject && titles.length === 0) {
          dispatch(setSelectedProject(initialProject));
        }
        return { hasMore };
      }

      console.log("Response of get projects", response);
    } catch (e) {
      console.log(e);
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

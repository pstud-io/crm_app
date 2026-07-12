import { api, apiEndpoint } from "@/api/client";
import axios from "axios";
import { useSelector } from "react-redux";
import { storage, StorageKeys } from "./storageFunctions";

export const fetchProjects = async (
  newPage: number = 1,
  searchQuery: string = "",
  organization_contact_id: string,
  token: string,
  organization_id: string,
  pageSize: number,
) => {
  console.log("In get projects", newPage);
  console.log("Trying with", newPage, searchQuery);
  const profile = await storage.get<any>(StorageKeys.PROFILE);

  const url = `${apiEndpoint}/customers/project/lite/?organization_contact_id=${profile.organization_contact_id}&search=${searchQuery}&page=${newPage}&page_size=${pageSize}`;
  return await api.get(url, {
    headers: {
      Authorization: `token ${token}`,
      "X-OrganizationID": organization_id,
    },
  });
};

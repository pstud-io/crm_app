import { getToken } from "@/utils/authFunctions";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import axios from "axios";

export const apiEndpoint = "https://api.projectstudio.ai" as const;

export const api = axios.create({
  baseURL: apiEndpoint,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    const profile = await storage.get<any>(StorageKeys.PROFILE);
    const organization_id = profile?.organization_id;
    if (token) {
      config.headers.Authorization = `token ${token}`;
      config.headers["x-organizationid"] = organization_id;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  },
);

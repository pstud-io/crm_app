import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
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
    const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);

    if (token && profile) {
      const organization_id = profile.organization_id;
      config.headers.Authorization = `token ${token}`;
      config.headers["x-organizationid"] = organization_id;
    } else {
      console.log("Profile or token is null form request interceptor");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.code === "ERR_CANCELED") {
      console.log("Request was aborted");
      return;
    }

    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  },
);

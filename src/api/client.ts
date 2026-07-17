import { ProfileSliceState } from "@/store/slices/profileSlice/profileSliceTypes";
import { RootState, store } from "@/store/store";
import { getToken } from "@/utils/authFunctions";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import axios from "axios";
import { useSelector } from "react-redux";

export const apiEndpoint = "https://api.projectstudio.ai" as const;

export const api = axios.create({
  baseURL: apiEndpoint,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  console.log("1 interceptor entered");

  // const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
  const profile = store.getState().profile;
  console.log("2 got profile", profile);

  const token = store.getState().auth.token;
  console.log("3 got token", token);

  if (token && profile) {
    console.log("4 setting headers");

    config.headers.Authorization = `token ${token}`;
    config.headers["x-organizationid"] = profile.organization_id;
  }

  console.log("5 returning config");

  return config;
});

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

import { createSlice, Dispatch } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage, StorageKeys } from "@/utils/storageFunctions";

const initialState = {
  name: "",
  phone: "",
  organization_contact_id: "",
  organization_id: "",
  logo_url: "",
  is_admin: false,
  organization_details: undefined,
  fk_user_role: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.organization_contact_id = action.payload.organization_contact_id;
      state.organization_id = action.payload.organization_id;
      state.logo_url = action.payload.logo_url;
      state.is_admin = action.payload.is_admin;
      state.organization_details = action.payload.organization_details;
      state.fk_user_role = action.payload.fk_user_role;
    },
    clearProfile: (state) => {
      state.name = "";
      state.phone = "";
      state.organization_contact_id = "";
      state.organization_id = "";
      state.logo_url = "";
      state.is_admin = false;
      state.organization_details = undefined;
      state.fk_user_role = "";
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

// Thunks for saving, loading, and removing profile data
export const saveProfile = async (profile: any, dispatch: Dispatch) => {
  try {
    console.log("Saving Profile in store:", profile);
    await storage.set(StorageKeys.PROFILE, profile);
    dispatch(setProfile(profile));
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};

export const loadProfile = async (dispatch: Dispatch) => {
  console.log("Loading Profile from store...");
  try {
    const profile = await storage.get<any>(StorageKeys.PROFILE);
    console.log("Profile from load profile", profile);
    if (profile) {
      dispatch(setProfile(profile));
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
};

export const removeProfile = () => async (dispatch: Dispatch) => {
  console.log("Removing Profile from store...");
  try {
    await AsyncStorage.removeItem("profile");
    dispatch(clearProfile());
  } catch (error) {
    console.error("Error removing profile:", error);
  }
};

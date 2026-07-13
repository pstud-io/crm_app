import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import {
  initialProfileSliceState,
  ProfileSliceState,
} from "./profileSliceTypes";

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileSliceState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileSliceState>) => {
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.is_admin = action.payload.is_admin;
      state.permissions = action.payload.permissions;
      state.fk_user_role = action.payload.fk_user_role;
      state.organization_contact_id = action.payload.organization_contact_id;
      state.organization_details = action.payload.organization_details;
      state.organization_id = action.payload.organization_id;
      state.logo_url = action.payload.logo_url;
    },
    clearProfile: () => ({ ...initialProfileSliceState }),
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

// Thunks for saving, loading, and removing profile data
export const saveProfile = async (
  profile: ProfileSliceState,
  dispatch: Dispatch,
) => {
  try {
    console.log("Saving Profile in store:", profile);
    dispatch(setProfile(profile));
    await storage.set<ProfileSliceState>(StorageKeys.PROFILE, profile);
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};

export const loadProfile = async (dispatch: Dispatch) => {
  console.log("Loading Profile from store...");
  try {
    const profile = await storage.get<ProfileSliceState>(StorageKeys.PROFILE);
    console.log("Profile from load profile", profile);
    if (profile) {
      dispatch(setProfile(profile));
    } else {
      dispatch(setProfile({ ...initialProfileSliceState }));
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    dispatch(setProfile({ ...initialProfileSliceState }));
  }
};

export const removeProfile = () => async (dispatch: Dispatch) => {
  console.log("Removing Profile from store...");
  try {
    dispatch(clearProfile());
    await storage.remove(StorageKeys.PROFILE);
  } catch (error) {
    console.error("Error removing profile:", error);
  }
};

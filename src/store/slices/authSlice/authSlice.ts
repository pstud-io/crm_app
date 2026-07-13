import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { initialAuthSliceState } from "./authSliceTypes";
import { storage, StorageKeys } from "@/utils/storageFunctions";
import { deleteToken, getToken, storeToken } from "@/utils/authFunctions";

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthSliceState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearToken: () => ({ ...initialAuthSliceState }),
  },
});

export const { setToken, setAuthenticated, clearToken } = authSlice.actions;

export const saveToken = async (
  token: string,
  dispatch: Dispatch,
): Promise<void> => {
  try {
    console.log("Saving Token in store:", token);
    await storeToken(token);
    dispatch(setToken(token));
    dispatch(setAuthenticated(true));
  } catch (error) {
    console.error("Error saving token:", error);
    dispatch(setAuthenticated(false));
  }
};

export const loadToken = async (dispatch: Dispatch): Promise<void> => {
  console.log("Loading Token from store...");
  try {
    const token = await getToken();
    if (token) {
      dispatch(setToken(token));
      dispatch(setAuthenticated(true));
    } else {
      dispatch(setToken(null));
      dispatch(setAuthenticated(false));
    }
  } catch (error) {
    console.error("Error loading token:", error);
    dispatch(setToken(null));
    dispatch(setAuthenticated(false));
  }
};

export const removeToken = async (dispatch: Dispatch): Promise<void> => {
  console.log("Removing Token from store...");
  try {
    await deleteToken();
    dispatch(clearToken());
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export default authSlice.reducer;

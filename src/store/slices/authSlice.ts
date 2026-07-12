import { createSlice, Dispatch } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@/utils/authFunctions";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, setAuthenticated, clearToken } = authSlice.actions;

export const saveToken = async (token: string, dispatch: Dispatch) => {
  try {
    console.log("Saving Token in store:", token);
    dispatch(setToken(token));
    dispatch(setAuthenticated(true));
  } catch (error) {
    console.error("Error saving token:", error);
    dispatch(setAuthenticated(false));
  }
};

export const loadToken = async (dispatch: Dispatch) => {
  console.log("Loading Token from store...");
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));

      // Fetch profile to validate the token
      dispatch(setAuthenticated(true));
    }
  } catch (error) {
    console.error("Error loading token:", error);
    dispatch(setAuthenticated(false));
  }
};

export const removeToken = async (dispatch: Dispatch) => {
  console.log("Removing Token from store...");
  try {
    await AsyncStorage.removeItem("token");
    dispatch(clearToken());
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export default authSlice.reducer;

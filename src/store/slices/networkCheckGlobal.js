import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  networkCheckGlobal: {
    isSlow: false,
    latency: null,
  },
  cachedNetworkCheckGlobal: {}, // Added to store the fetched project data
};

const networkCheckGlobalSlice = createSlice({
  name: "networkCheckGlobal",
  initialState,
  reducers: {
    setNetworkCheckGlobal: (state, action) => {
      state.networkCheckGlobal = action.payload;
    },
    setCachedNetworkCheckGlobal: (state, action) => {
      state.cachedNetworkCheckGlobal = action.payload; // Action to cache the project data
    },
  },
});

export const { setNetworkCheckGlobal, setCachedNetworkCheckGlobal } =
  networkCheckGlobalSlice.actions;
export default networkCheckGlobalSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeSubButtonGlobal: null,
  cachedActiveSubButtonGlobal: {}, // Added to store the fetched project data
};

export const activeSubButtonGlobalSlice = createSlice({
  name: "activeSubButtonGlobal",
  initialState,
  reducers: {
    setActiveSubButtonGlobal: (state, action) => {
      state.activeSubButtonGlobal = action.payload;
    },
    setCachedActiveSubButtonGlobal: (state, action) => {
      state.cachedActiveSubButtonGlobal = action.payload; // Action to cache the project data
    },
  },
});

export const { setActiveSubButtonGlobal, setCachedActiveSubButtonGlobal } =
  activeSubButtonGlobalSlice.actions;
export default activeSubButtonGlobalSlice.reducer;

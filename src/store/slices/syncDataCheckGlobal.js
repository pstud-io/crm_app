import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  syncDataCheckGlobal: {
    hasData: false,
    count: 0,
  },
  cachedSyncDataCheckGlobal: {}, // Added to store the fetched project data
};

const syncDataCheckGlobalSlice = createSlice({
  name: "syncDataCheckGlobal",
  initialState,
  reducers: {
    setSyncDataCheckGlobal: (state, action) => {
      state.syncDataCheckGlobal = action.payload;
    },
    setCachedSyncDataCheckGlobal: (state, action) => {
      state.cachedSyncDataCheckGlobal = action.payload; // Action to cache the project data
    },
  },
});

export const { setSyncDataCheckGlobal, setCachedSyncDataCheckGlobal } =
  syncDataCheckGlobalSlice.actions;
export default syncDataCheckGlobalSlice.reducer;

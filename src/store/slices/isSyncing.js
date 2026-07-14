import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSyncing: false,
  cachedIsSyncing: {}, // Added to store the fetched project data
};

const isSyncingSlice = createSlice({
  name: "isSyncing",
  initialState,
  reducers: {
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setCachedIsSyncing: (state, action) => {
      state.cachedIsSyncing = action.payload; // Action to cache the project data
    },
  },
});

export const { setIsSyncing, setCachedIsSyncing } = isSyncingSlice.actions;
export default isSyncingSlice.reducer;

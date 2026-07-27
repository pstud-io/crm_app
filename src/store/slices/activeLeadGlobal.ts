import { createSlice } from "@reduxjs/toolkit";
import { ProjectRecord } from "./projectSlice/projectSliceTypes";

export interface LeadRecord {
  id: string | null;
  project_name: string | null;
}

export const initialState: LeadRecord = {
  id: null,
  project_name: null,
};

export const activeLeadSlice = createSlice({
  name: "activeLead",
  initialState,
  reducers: {
    setActiveLead: (state, action) => {
      state.id = action.payload.id;
      state.project_name = action.payload.project_name;
    },
  },
});

export const { setActiveLead } = activeLeadSlice.actions;
export default activeLeadSlice.reducer;

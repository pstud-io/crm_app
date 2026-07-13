import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialProjectSliceState, ProjectRecord } from "./projectSliceTypes";

export const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectSliceState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<ProjectRecord>) => {
      state.id = action.payload.id;
      state.project_name = action.payload.project_name;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;

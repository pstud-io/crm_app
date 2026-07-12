import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProject: null,
  cachedProjects: [], // Added to store the fetched project data
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setCachedProjects: (state, action) => {
      state.cachedProjects = action.payload; // Action to cache the project data
    },
  },
});

export const { setSelectedProject, setCachedProjects } = projectSlice.actions;
export default projectSlice.reducer;

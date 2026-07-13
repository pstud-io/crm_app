import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./slices/profileSlice/profileSlice";
import { authSlice } from "./slices/authSlice/authSlice";
import { projectSlice } from "./slices/projectSlice/projectSlice";

export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
    auth: authSlice.reducer,
    project: projectSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

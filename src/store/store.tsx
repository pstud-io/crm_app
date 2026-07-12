import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./slices/profileSlice";
import { authSlice } from "./slices/authSlice";
import { projectSlice } from "./slices/projectSlice";
export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
    auth: authSlice.reducer,
    project: projectSlice.reducer,
  },
});

store.subscribe(() => console.log(store.getState()));

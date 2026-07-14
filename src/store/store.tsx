import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./slices/profileSlice/profileSlice";
import { authSlice } from "./slices/authSlice/authSlice";
import { projectSlice } from "./slices/projectSlice/projectSlice";
import activeSubButtonGlobalReducer from "./slices/activeSubButtonGlobal";
import networkCheckGlobal from "./slices/networkCheckGlobal";
import syncDataCheckGlobal from "./slices/syncDataCheckGlobal";
import isSyncing from "./slices/isSyncing";
export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer,
    auth: authSlice.reducer,
    project: projectSlice.reducer,
    activeSubButtonGlobal: activeSubButtonGlobalReducer,
    networkCheckGlobal: networkCheckGlobal,
    syncDataCheckGlobal: syncDataCheckGlobal,
    isSyncing: isSyncing,
  },
});

export type RootState = ReturnType<typeof store.getState>;

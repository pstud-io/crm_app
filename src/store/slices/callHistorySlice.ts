import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CallHistory {
  project_id: string;
  project_name: string;
  task_name: string;
  task_id: string;
  client_phone: string;
  client_name: string;
  duration: number | undefined;
  contacted_on: string | undefined;
}

export const callHistoryInitialState: CallHistory = {
  project_id: "",
  project_name: "",
  task_name: "",
  task_id: "",
  client_phone: "",
  client_name: "",
  duration: undefined,
  contacted_on: undefined,
};

export const callHistorySlice = createSlice({
  name: "callHistory",
  initialState: callHistoryInitialState,
  reducers: {
    setCallHistory: (state, action: PayloadAction<CallHistory>) => {
      state.project_id = action.payload.project_id;
      state.project_name = action.payload.project_name;
      state.task_name = action.payload.task_name;
      state.task_id = action.payload.task_id;
      state.client_phone = action.payload.client_phone;
      state.client_name = action.payload.client_name;
      state.duration = action.payload.duration;
      state.contacted_on = action.payload.contacted_on;
    },
  },
});

export const { setCallHistory } = callHistorySlice.actions;
export default callHistorySlice.reducer;

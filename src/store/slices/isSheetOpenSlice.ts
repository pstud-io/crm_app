import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSheetOpen: false,
};

export const isSheetButtonOpenSlice = createSlice({
  name: "isSheetOpen",
  initialState,
  reducers: {
    setIsSheetOpen: (state, action) => {
      state.isSheetOpen = action.payload;
    },
  },
});

export const { setIsSheetOpen } = isSheetButtonOpenSlice.actions;

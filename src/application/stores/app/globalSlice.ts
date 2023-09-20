import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Props = {
  reset: number;
  loading: boolean;
};

const initialState: Props = {
  reset: 0,
  loading: false,
};

export const globalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    globalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    globalReset: (state) => {
      state.reset += 1;
    },
  },
});

export const { globalLoading, globalReset } = globalSlice.actions;

export default globalSlice.reducer;

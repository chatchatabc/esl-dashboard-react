import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Props = {
  title?: string;
  show: boolean;
  content?: string;
  data?: Record<string, any>;
};

const initialState: Props = {
  show: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    modalUpdate: (state, action: PayloadAction<Props>) => {
      state.title = action.payload.title;
      state.show = action.payload.show;
      state.content = action.payload.content;
      state.data = action.payload.data;
    },
  },
});

export const { modalUpdate } = modalSlice.actions;

export default modalSlice.reducer;

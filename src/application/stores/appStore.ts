import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./app/modalSlice";
import globalReducer from "./app/globalSlice";

const appStore = configureStore({
  reducer: {
    modal: modalReducer,
    global: globalReducer,
  },
});

export default appStore;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof appStore.dispatch;

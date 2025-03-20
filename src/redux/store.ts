import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slice";

export const store = configureStore({
  reducer: {
    user: usersReducer,
  },
});

// Lấy kiểu RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

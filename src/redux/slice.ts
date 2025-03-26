import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  user: any;
}

const initialState: CounterState = {
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

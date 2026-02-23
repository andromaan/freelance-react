import { createSlice } from "@reduxjs/toolkit";
import type { UserVM } from "../types/user.types";
import { userApi } from "../services/user/userApi";

interface UserState {
  currentUser: UserVM | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // Автоматично зберігає дані коли getMyself query виконується успішно
    builder.addMatcher(
      userApi.endpoints.getMyself.matchFulfilled,
      (state, { payload }) => {
        state.currentUser = payload;
      },
    );
  },
});

export const { clearUser } = userSlice.actions;
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export default userSlice.reducer;

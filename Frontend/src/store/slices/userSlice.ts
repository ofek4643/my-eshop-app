import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { getUser } from "../../api/user";

// Thunk שמושך את פרטי המשתמש מהשרת
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUser();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || error.response?.data?.message);
    }
  }
);
// מייצג את ה state של המשתמש
interface UserState {
  user: User | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}
// ערכים התחלתיים של ה state
const initialState: UserState = {
  user: null,
  status: "idle", // idle , loading , success , failed
  error: null,
};
// הגדרת הslice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // פעולה שמנקה את ה-state של המשתמש
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload; // <-- כאן מעדכן את המשתמש
    },
  },

  extraReducers: (builder) => {
    // ניהול מצבים של getUserThunk (pending, fulfilled, rejected)
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
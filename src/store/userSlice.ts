import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../types/login";
import type { UserState } from "../types/user";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const loginUser = createAsyncThunk<
  LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>("user/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.authenticated) {
      return rejectWithValue(data.message ?? "Login failed");
    }

    return data;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

export const updateUserLocale = createAsyncThunk<
  string,
  { username: string; locale: string },
  { rejectValue: string }
>(
  "user/updateUserLocale",
  async ({ username, locale }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${username}/locale`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        return rejectWithValue("Failed to update locale");
      }

      return locale;
    } catch {
      return rejectWithValue("Unable to connect to the API");
    }
  },
);

const initialState: UserState = {
  currentUser: null,
  token: null,
  locale: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.locale = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.username;
        state.token = action.payload.token;
        state.locale = action.payload.locale;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.currentUser = null;
        state.token = null;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(updateUserLocale.fulfilled, (state, action) => {
        state.locale = action.payload;
      });
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;

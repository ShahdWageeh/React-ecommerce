import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const TOKEN_KEY = "rt_ecom_token";
const USER_KEY = "rt_ecom_user";

function saveAuthToStorage({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuthFromStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function loadToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function loadUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

api.interceptors.request.use((config) => {
  const token = loadToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.token = token;
  }
  return config;
});

function apiErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    "Something went wrong"
  );
}

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signin", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      return {
        provider: "google",
        user: {
          name: user.displayName || "Google User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          uid: user.uid,
        },
      };
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  clearAuthFromStorage();
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
});

const initialState = {
  token: loadToken(),
  user: loadUser(),
  googleUser: null,
  status: "idle",
  error: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const token = action.payload?.token || "";
        const user = action.payload?.user || null;
        state.token = token;
        state.user = user;
        if (token) saveAuthToStorage({ token, user });
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Signup failed";
      })
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const token = action.payload?.token || "";
        const user = action.payload?.user || null;
        state.token = token;
        state.user = user;
        if (token) saveAuthToStorage({ token, user });
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Login failed";
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const googleUser = action.payload?.user || null;
        state.googleUser = googleUser;
        // Firebase Google login does NOT provide the Route API JWT token.
        // Keep `token` for Route API auth only, but still treat the user as
        // signed in for UI purposes by setting/persisting the user object.
        state.token = "";
        state.user = googleUser;
        saveAuthToStorage({ token: "", user: googleUser });
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Google login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = "";
        state.user = null;
        state.googleUser = null;
        state.status = "idle";
        state.error = "";
      });
  },
});

export default authSlice.reducer;


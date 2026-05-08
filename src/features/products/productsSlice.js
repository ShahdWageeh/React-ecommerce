import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rt_ecom_token") || "";
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

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: "",
  selected: null,
  selectedStatus: "idle",
  selectedError: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
      state.selectedStatus = "idle";
      state.selectedError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.items = action.payload?.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selectedError = "";
        state.selected = action.payload?.data || null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError =
          action.payload || action.error.message || "Failed to load product";
      });
  },
});

export const { clearSelected } = productsSlice.actions;
export default productsSlice.reducer;


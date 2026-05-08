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

export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      if (!token) {
        return rejectWithValue(
          "Cart requires Route API login. Please sign in with email/password."
        );
      }
      const res = await api.get("/cart");
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      if (!token) {
        return rejectWithValue(
          "Cart requires Route API login. Please sign in with email/password."
        );
      }
      const res = await api.post("/cart", { productId });
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      if (!token) {
        return rejectWithValue(
          "Cart requires Route API login. Please sign in with email/password."
        );
      }
      const res = await api.delete(`/cart/${productId}`);
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  "cart/updateQty",
  async ({ productId, count }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      if (!token) {
        return rejectWithValue(
          "Cart requires Route API login. Please sign in with email/password."
        );
      }
      const res = await api.put(`/cart/${productId}`, { count });
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;
      if (!token) {
        return rejectWithValue(
          "Cart requires Route API login. Please sign in with email/password."
        );
      }
      const res = await api.delete("/cart");
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

export const startCheckout = createAsyncThunk(
  "cart/checkout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const apiToken = getState()?.auth?.token;
      if (!apiToken) {
        return rejectWithValue(
          "Checkout requires Route API login. Please sign in with email/password."
        );
      }
      const state = getState();
      const cartId = state.cart.cartId;
      if (!cartId) return rejectWithValue("No cart found. Add items first.");

      const url = window.location.origin;
      // Route API defines this as POST (not GET).
      const res = await api.post(
        `/orders/checkout-session/${cartId}`,
        null,
        { params: { url } }
      );
      return res.data;
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e));
    }
  }
);

const initialState = {
  cartId: "",
  numOfCartItems: 0,
  totalCartPrice: 0,
  items: [],
  status: "idle",
  error: "",
  checkoutUrl: "",
  checkoutStatus: "idle",
  checkoutError: "",
};

function normalizeCartPayload(payload) {
  const data = payload?.data;
  const cartId = data?._id || payload?.cartId || "";
  const items = data?.products || payload?.products || [];
  const totalCartPrice = data?.totalCartPrice || payload?.totalCartPrice || 0;
  const numOfCartItems = payload?.numOfCartItems ?? items.length ?? 0;
  return { cartId, items, totalCartPrice, numOfCartItems };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCheckout(state) {
      state.checkoutUrl = "";
      state.checkoutStatus = "idle";
      state.checkoutError = "";
    },
    resetCartState(state) {
      state.cartId = "";
      state.numOfCartItems = 0;
      state.totalCartPrice = 0;
      state.items = [];
      state.status = "idle";
      state.error = "";
      state.checkoutUrl = "";
      state.checkoutStatus = "idle";
      state.checkoutError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        Object.assign(state, normalizeCartPayload(action.payload));
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Cart failed";
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        Object.assign(state, normalizeCartPayload(action.payload));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Add failed";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        Object.assign(state, normalizeCartPayload(action.payload));
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Remove failed";
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        Object.assign(state, normalizeCartPayload(action.payload));
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Update failed";
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = "";
        state.cartId = "";
        state.numOfCartItems = 0;
        state.totalCartPrice = 0;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Clear cart failed";
      })
      .addCase(startCheckout.pending, (state) => {
        state.checkoutStatus = "loading";
        state.checkoutError = "";
        state.checkoutUrl = "";
      })
      .addCase(startCheckout.fulfilled, (state, action) => {
        state.checkoutStatus = "succeeded";
        state.checkoutError = "";
        state.checkoutUrl =
          action.payload?.session?.url ||
          action.payload?.url ||
          action.payload?.session?.redirectUrl ||
          "";
      })
      .addCase(startCheckout.rejected, (state, action) => {
        state.checkoutStatus = "failed";
        state.checkoutError =
          action.payload || action.error.message || "Checkout failed";
      });
  },
});

export const { clearCheckout, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;


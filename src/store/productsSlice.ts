import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type ProductsState = {
  items: Product[];
};

export const fetchProductsByLocale = createAsyncThunk<
  Product[],
  { locale: string },
  { rejectValue: string }
>("products/fetchByLocale", async ({ locale }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?locale=${encodeURIComponent(locale)}`,
    );

    if (!response.ok) {
      return rejectWithValue("Failed to load products");
    }

    const data: Product[] = await response.json();
    return data;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

export const createProduct = createAsyncThunk<
  Product,
  { name: string; price: number; currency: string; locale: string },
  { rejectValue: string }
>(
  "products/create",
  async ({ name, price, currency, locale }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        name,
        price: price.toString(),
        currency,
      });
      const response = await fetch(`${API_BASE_URL}/products?${params}`, {
        method: "POST",
      });

      if (!response.ok) {
        return rejectWithValue("Failed to create product");
      }

      // The API returns the raw product (with usdPrice), but we need to
      // return a localized version matching the Product type
      const raw = await response.json();
      return {
        id: raw.id,
        name: raw.name,
        price,
        currency,
        locale,
      } as Product;
    } catch {
      return rejectWithValue("Unable to connect to the API");
    }
  },
);

const initialState: ProductsState = {
  items: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    clearProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByLocale.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchProductsByLocale.rejected, (state) => {
        state.items = [];
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setProducts, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserPackage } from "../types/package";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type PackagesState = {
  items: UserPackage[];
};

export const fetchPackagesByOwner = createAsyncThunk<
  UserPackage[],
  { ownerUsername: string },
  { rejectValue: string }
>("packages/fetchByOwner", async ({ ownerUsername }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/packages?ownerUsername=${encodeURIComponent(ownerUsername)}`,
    );

    if (!response.ok) {
      return rejectWithValue("Failed to load packages");
    }

    const data: UserPackage[] = await response.json();
    return data;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

export const createPackageInDb = createAsyncThunk<
  UserPackage,
  Omit<UserPackage, "id">,
  { rejectValue: string }
>("packages/createPackageInDb", async (packagePayload, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packagePayload),
    });

    if (!response.ok) {
      return rejectWithValue("Failed to create package");
    }

    const createdPackage: UserPackage = await response.json();
    return createdPackage;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

export const updatePackageInDb = createAsyncThunk<
  UserPackage,
  UserPackage,
  { rejectValue: string }
>("packages/updatePackageInDb", async (packagePayload, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/packages/${packagePayload.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packagePayload),
      },
    );

    if (!response.ok) {
      return rejectWithValue("Failed to update package");
    }

    const updatedPackage: UserPackage = await response.json();
    return updatedPackage;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

export const deletePackageInDb = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("packages/deletePackageInDb", async (packageId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return rejectWithValue("Failed to delete package");
    }

    return packageId;
  } catch {
    return rejectWithValue("Unable to connect to the API");
  }
});

const initialState: PackagesState = {
  items: [],
};

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    setPackages: (state, action: PayloadAction<UserPackage[]>) => {
      state.items = action.payload;
    },
    addPackage: (state, action: PayloadAction<UserPackage>) => {
      state.items = [action.payload, ...state.items];
    },
    clearPackages: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackagesByOwner.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPackagesByOwner.rejected, (state) => {
        state.items = [];
      })
      .addCase(createPackageInDb.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updatePackageInDb.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (pkg) => pkg.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePackageInDb.fulfilled, (state, action) => {
        state.items = state.items.filter((pkg) => pkg.id !== action.payload);
      });
  },
});

export const { setPackages, addPackage, clearPackages } = packagesSlice.actions;
export default packagesSlice.reducer;

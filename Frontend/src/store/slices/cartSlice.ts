import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addOneItemCart,
  fetchCart,
  removeItemCart,
  removeOneItemCart,
  syncCart,
} from "../../api/Cart";

import { CartItem } from "../../types/Cart";

// Thunk שמושך את העגלה של המשתמש מהשרת
export const fetchUserCartThunk = createAsyncThunk<CartItem[], void>(
  "cart/fetchUserCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCart();
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Thunk מוסיף מוצר אחד מהעגלה של המשתמש
export const addOneItemThunk = createAsyncThunk<CartItem, string>(
  "cart/addOneItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await addOneItemCart({ productId });
      return res;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
// Thunk מסיר מוצר אחד מהעגלה של המשתמש
export const removeOneItemThunk = createAsyncThunk<CartItem, string>(
  "cart/removeOneItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await removeOneItemCart({ productId });
      return res;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
// Thunk מסיר את כל המוצר מהעגלה של המשתמש
export const removeItemThunk = createAsyncThunk<CartItem, string>(
  "cart/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await removeItemCart({ productId });
      return res;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const syncCartThunk = createAsyncThunk<void, CartItem[]>(
  "cart/syncCart",
  async (items, { rejectWithValue }) => {
    try {
      await syncCart({
        items: items.map((item) => ({
          productId: item._id,
          amount: item.amount,
        })),
      });
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// מייצג את ה state של העגלה
interface CartState {
  items: CartItem[];
  userCart: CartItem[];
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

const loadCartFromStorage = (): CartItem[] => {
  const data = localStorage.getItem("guestCart");
  return data ? JSON.parse(data) : [];
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  userCart: [],
  status: "idle", // idle , loading , success , failed
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existing) {
        if (existing.amount + action.payload.amount <= existing.stock) {
          existing.amount += action.payload.amount;
        }
      } else {
        state.items.push({
          ...action.payload,
          amount: action.payload.amount,
        });
      }
      saveCartToStorage(state.items);
    },
    clearUserCart: (state) => {
      state.items = [];
      state.userCart = [];
      localStorage.removeItem("guestCart");
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveCartToStorage(state.items);
    },
    addOneItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.amount < item.stock) {
        item.amount++;
      }
      saveCartToStorage(state.items);
    },
    removeOneItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item && item.amount > 1) {
        item.amount--;
      } else {
        state.items = state.items.filter((i) => i._id !== action.payload);
      }
      saveCartToStorage(state.items);
    },
    mergeGuestToUserCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCartThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserCartThunk.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "success";
          state.userCart = action.payload;
        }
      )
      .addCase(fetchUserCartThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  addOneItem,
  removeOneItem,
  mergeGuestToUserCart,
  clearUserCart,
} = cartSlice.actions;
export default cartSlice.reducer;

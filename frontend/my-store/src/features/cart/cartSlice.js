import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";


export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
    try {
        const access = localStorage.getItem("access");
        const res = await axios.get(API.CART, {
        headers: { Authorization: `Bearer ${access}` },
        });
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue("Failed to load cart");
    }
    });

export const removeCartItem = createAsyncThunk("cart/removeItem", async (id, thunkAPI) => {
    try {
        const access = localStorage.getItem("access");
        await axios.delete(`${API.CART}${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
        });
        return id;
    } catch (err) {
        return thunkAPI.rejectWithValue("Failed to remove item");
    }
});

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ id, quantity }, thunkAPI) => {
        try {
            const access = localStorage.getItem("access");
            const response = await axios.patch(
            `${API.CART}${id}/`,
            { quantity },
            { headers: { Authorization: `Bearer ${access}` } }
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to update quantity");
        }
        }
);



export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ product, quantity }, { rejectWithValue }) => {
        const access = localStorage.getItem("access");
        if (!access) {
            // no token → not logged in
            return rejectWithValue({ login: true });
        }
        try {
            const response = await axios.post(
                API.CART,
            { product, quantity },
            { headers: { Authorization: `Bearer ${access}` } }
            );
            return response.data;
        } catch (err) {
            if (err.response?.status === 401) {
            // token expired or invalid
            return rejectWithValue({ login: true });
            }
            return rejectWithValue(err.response?.data || "Add to cart failed");
        }
        }
);


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(removeCartItem.fulfilled, (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        })
        .addCase(updateCartItem.fulfilled, (state, action) => {
            const updatedItem = action.payload;
            const index = state.items.findIndex((item) => item.id === updatedItem.id);
            if (index !== -1) {
                state.items[index].quantity = updatedItem.quantity;
                }
        })
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
},
});

export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
        const access = localStorage.getItem("access");
        const response = await axios.get(API.ORDERS, {
            headers: {
            Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data?.detail || "Failed to fetch orders");
        }
    }
);

export const placeOrder = createAsyncThunk("order/placeOrder", async (_, thunkAPI) => {
    const access = localStorage.getItem("access");
    try {
        const response = await axios.post(
        API.ORDERS,
        {},
        { headers: { Authorization: `Bearer ${access}` } }
        );
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue("Failed to place order");
    }
});

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        placing: false,
        success: false,
        orderId: null,
    },
    reducers: {
    resetOrderStatus: (state) => {
        state.placing = false;
        state.success = false;
        state.orderId = null;
        state.error = null;
    },
},
extraReducers: (builder) => {
    builder
        .addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(placeOrder.pending, (state) => {
            state.placing = true;
            state.error = null;
            state.success = false;
        })
        .addCase(placeOrder.fulfilled, (state, action) => {
            state.placing = false;
            state.success = true;
            state.orderId = action.payload.order_id;
        })
        .addCase(placeOrder.rejected, (state, action) => {
            state.placing = false;
            state.error = action.payload;
            state.success = false;
        });
    },
});

export const { resetOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

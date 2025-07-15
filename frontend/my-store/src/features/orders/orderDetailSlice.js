import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";

export const fetchOrderDetail = createAsyncThunk(
    "orderDetail/fetchOrderDetail",
    async (orderId, { rejectWithValue }) => {
        try {
        const access = localStorage.getItem("access");
        const response = await axios.get(`${API.ORDERS}${orderId}/`, {
            headers: {
            Authorization: `Bearer ${access}`,
            },
        });
        return response.data;
        } catch (err) {
        return rejectWithValue("Failed to fetch order details.");
        }
    }
);

const orderDetailSlice = createSlice({
    name: "orderDetail",
    initialState: {
        order: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderDetail: (state) => {
        state.order = null;
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrderDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        })
        .addCase(fetchOrderDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearOrderDetail } = orderDetailSlice.actions;
export default orderDetailSlice.reducer;

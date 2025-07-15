import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";

export const fetchProductDetail = createAsyncThunk(
    "products/fetchProductDetail",
    async (id, { rejectWithValue }) => {
        try {
        const res = await axios.get(`${API.PRODUCTS}${id}/`);
        return res.data;
        } catch (err) {
        return rejectWithValue("Failed to fetch product.");
        }
    }
    );

    const productDetailSlice = createSlice({
    name: "productDetail",
    initialState: {
        product: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProductDetail: (state) => {
        state.product = null;
        state.loading = false;
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProductDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        })
        .addCase(fetchProductDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearProductDetail } = productDetailSlice.actions;
export default productDetailSlice.reducer;

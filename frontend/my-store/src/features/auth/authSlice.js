import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../api";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
        const response = await axios.post(API.LOGIN, credentials);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data.detail || "Login failed");
        }
    }
    );

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
        const response = await axios.post(API.REGISTER, userData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response.data || "Registration failed");
        }
    }
    );

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        access: localStorage.getItem("access") || null,
        refresh: localStorage.getItem("refresh") || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
            localStorage.setItem("access", action.payload.access);
            localStorage.setItem("refresh", action.payload.refresh);
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../services/api';

// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async ({ username, password }, { rejectWithValue }) => {
//         try {
//         const response = await api.post('token/', { username, password });
//         return response.data.access;
//         } catch (err) {
//         return rejectWithValue(err.response.data);
//         }
//     }
// );

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: { token: localStorage.getItem('token') || null, status: null, error: null },
//     reducers: {
//         logout: state => {
//         state.token = null;
//         localStorage.removeItem('token');
//         }
//     },
//     extraReducers: builder => {
//         builder
//         .addCase(loginUser.pending, state => { state.status = 'loading'; })
//         .addCase(loginUser.fulfilled, (state, action) => {
//             state.status = 'succeeded';
//             state.token = action.payload;
//             localStorage.setItem('token', action.payload);
//         })
//         .addCase(loginUser.rejected, (state, action) => {
//             state.status = 'failed';
//             state.error = action.payload;
//         });
//     }
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
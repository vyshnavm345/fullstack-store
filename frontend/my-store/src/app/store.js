import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/ordersSlice";
import orderDetailReducer from "../features/orders/orderDetailSlice";
import productDetailReducer from "../features/products/productDetailSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        orders: ordersReducer,
        orderDetail: orderDetailReducer,
        productDetail: productDetailReducer,
    },
});
const BASE_URL = "http://127.0.0.1:8000";

export const API = {
    BASE: BASE_URL,
    LOGIN: `${BASE_URL}/api/token/`,
    REFRESH: `${BASE_URL}/api/token/refresh/`,
    REGISTER: `${BASE_URL}/api/register/`,
    PRODUCTS: `${BASE_URL}/api/products/`,
    CART: `${BASE_URL}/api/cart/`,
    ORDERS: `${BASE_URL}/api/orders/`,
};

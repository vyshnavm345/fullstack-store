import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem, updateCartItem } from "../features/cart/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { placeOrder } from "../features/orders/ordersSlice";

const Cart = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.cart);
    const { placing } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (id) => {
        dispatch(removeCartItem(id));
    };

    const handlePlaceOrder = async () => {
        dispatch(placeOrder())
        .unwrap()
        .then((data) => {
            toast.success(`Order placed! Order ID: ${data.order_id}`);
            dispatch(fetchCart());
        })
        .catch(() => toast.error("Failed to place order"));
    };

    if (loading) return <p className="p-4">Loading cart...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {items.length === 0 ? (
            <p>Your cart is empty.</p>
        ) : (
            <>
            <ul className="space-y-4">
            {items.map((item) => (
            <li
                key={item.id}
                className="flex justify-between items-center border p-4 rounded shadow"
            >
                <div>
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-gray-500">₹{item.product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                    <button
                    onClick={() =>
                        item.quantity > 1 &&
                        dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }))
                    }
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                    −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                    onClick={() =>
                        dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }))
                    }
                    className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                    >
                    +
                    </button>
                </div>
                </div>

                <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                Remove
                </button>
            </li>
            ))}

            </ul>
            <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" >
                {placing ? "Placing Order..." : "Place Order"}
            </button>
            </>
        )}
        </div>
    );
};

export default Cart;

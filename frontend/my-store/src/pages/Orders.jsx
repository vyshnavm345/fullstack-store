import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orders/ordersSlice";
import { Link } from "react-router-dom";

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (loading) return <p className="p-4">Loading orders...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {orders.length === 0 ? (
            <p>You have no orders.</p>
        ) : (
            <ul className="space-y-4">
            {orders.map((order) => (
                <li key={order.id} className="border p-4 rounded shadow">
                <p className="font-semibold">Order #{order.id}</p>
                <p>Status: {order.status}</p>
                <p>Total: ₹{order.total_amount}</p>
                <p>Items: {order.items.length}</p>
                <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                <p><Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">View Details</Link></p>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default Orders;

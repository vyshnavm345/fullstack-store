import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetail, clearOrderDetail } from "../features/orders/orderDetailSlice";

const OrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.orderDetail);

    useEffect(() => {
        dispatch(fetchOrderDetail(id));
        return () => {
            dispatch(clearOrderDetail());
        };
    }, [dispatch, id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;
    if (!order) return null;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
            <p>Status: {order.status}</p>
            <p>Total Amount: ₹{order.total_amount}</p>
            <p>Placed On: {new Date(order.created_at).toLocaleString()}</p>

            <h3 className="mt-6 font-semibold text-xl">Items:</h3>
            {order.items && order.items.length > 0 ? (
                <ul className="mt-2 space-y-2">
                    {order.items.map((item) => (
                        <li key={item.id} className="border p-3 rounded shadow">
                            <p className="font-medium">{item.product.name}</p>
                            <p>Price: ₹{item.product.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in this order.</p>
            )}
        </div>
    );
};

export default OrderDetail;

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
    fetchProductDetail,
    clearProductDetail,
} from "../features/products/productDetailSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((s) => s.productDetail);

    useEffect(() => {
        dispatch(fetchProductDetail(id));
        return () => {
        dispatch(clearProductDetail());
        };
    }, [dispatch, id]);

    const handleAdd = () => {
        dispatch(addToCart({ product: id, quantity: 1 }))
        .unwrap()
        .then(() => toast.success("Added to cart!"))
        .catch((err) => {
            if (err.login) {
            toast.info("You need to log in first");
            navigate("/login");
            } else {
            toast.error(err || "Failed to add to cart.");
            }
        });
    };

    if (loading) return <p className="p-6 text-center text-gray-500">Loading…</p>;
    if (error)   return <p className="p-6 text-center text-red-600">{error}</p>;
    if (!product) return <p className="p-6 text-center">Product not found</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
        <div className="flex flex-col md:flex-row gap-6 items-center">
            {product.image && (
            <img
                src={product.image}
                alt={product.name}
                className="w-64 h-64 object-contain rounded border"
            />
            )}
            <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
            <p className="text-xl text-green-600 font-semibold mb-2">₹{product.price}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleAdd}
            >
                Add to Cart
            </button>
            </div>
        </div>
        </div>
    );
};

export default ProductDetail;

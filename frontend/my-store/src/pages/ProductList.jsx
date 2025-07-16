import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading, error } = useSelector((s) => s.products);
    const { loading: cartLoading } = useSelector((s) => s.cart);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddToCart = (productId) => {
        dispatch(addToCart({ product: productId, quantity: 1 }))
        .unwrap()
        .then(() => {
            toast.success("Added to cart!");
        })
        .catch((err) => {
            if (err.login) {
            toast.info("You need to log in first");
            navigate("/login");
            } else {
            toast.error(err || "Failed to add to cart.");
            }
        });
    };

    if (loading) return <p className="p-4">Loading products…</p>;
    if (error)   return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
            <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <Link to={`/products/${p.id}`}>
                {p.image && (
                    <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-contain mb-3 rounded"
                    />
                )}
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                    {p.name}
                </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <p className="font-bold text-green-600 mt-2">₹{p.price}</p>
                <button
                onClick={() => handleAddToCart(p.id)}
                className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={cartLoading}
                >
                Add to Cart
                </button>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ProductList;

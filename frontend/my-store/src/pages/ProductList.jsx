import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductList = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);
    const { loading: cartLoading, error: cartError } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddToCart = (productId) => {
        dispatch(addToCart({ product: productId, quantity: 1 }))
        .unwrap()
        .then(() => toast.success("Added to cart!"))
        .catch(() => toast.error("Failed to add to cart."));
    };

    if (loading) return <p className="p-4">Loading products...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
                <Link to={`/products/${product.id}`}>
                {product.image && (
                    <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-contain mb-3 rounded"
                    />
                )}
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                    {product.name}
                </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <p className="font-bold text-green-600 mt-2">₹{product.price}</p>
                <button
                onClick={() => handleAddToCart(product.id)}
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

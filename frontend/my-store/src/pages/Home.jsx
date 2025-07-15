import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="p-8 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to MyStore 🛍️</h1>
        <p className="text-gray-600 text-lg mb-6">
            Explore the best products at unbeatable prices. Shop smart, shop now!
        </p>

        <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
            Browse Products
        </Link>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 shadow-md rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">🚚 Fast Delivery</h2>
            <p className="text-gray-600">Get your orders delivered within 2–3 days across major cities.</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">🔒 Secure Payments</h2>
            <p className="text-gray-600">Your payments are protected with top-level security and encryption.</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">💬 24/7 Support</h2>
            <p className="text-gray-600">Need help? Our team is ready to assist you anytime, anywhere.</p>
            </div>
        </div>
        </div>
    );
}

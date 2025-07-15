import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
    const dispatch = useDispatch();
    const { access, loading } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    if (access) {
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData))
        .unwrap()
        .then(() => {
            toast.success("Logged in successfully!");
        })
        .catch((err) => {
            toast.error(err || "Login failed");
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            <div className="mb-4">
            <label className="block mb-1 text-sm">Username</label>
            <input
                type="text"
                name="username"
                className="w-full px-3 py-2 border rounded"
                value={formData.username}
                onChange={handleChange}
                required
            />
            </div>

            <div className="mb-4">
            <label className="block mb-1 text-sm">Password</label>
            <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border rounded"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>
            {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}
            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            disabled={loading}
            >
            {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
                Register here
            </a>
            </p>
        </form>
        </div>
    );
}

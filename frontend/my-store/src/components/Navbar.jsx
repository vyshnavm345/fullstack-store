import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { access } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">
            <Link to="/">🛒 MyStore</Link>
        </div>

        <div className="flex gap-4 items-center">
            <Link to="/" className="hover:text-gray-300">
            Home
            </Link>
            <Link to="/products" className="hover:text-gray-300">
            Products
            </Link>
            <Link to="/cart" className="hover:text-gray-300">
            Cart
            </Link>

            {access ? (
            <>
                <Link to="/orders" className="hover:text-gray-300">
                My Orders
                </Link>
                <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                Logout
                </button>
            </>
            ) : (
            <>
                <Link to="/login" className="hover:text-gray-300">
                Login
                </Link>
                <Link to="/register" className="hover:text-gray-300">
                Register
                </Link>
            </>
            )}
        </div>
        </nav>
    );
}

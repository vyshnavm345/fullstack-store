import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, access } = useSelector((state) => state.auth);

    useEffect(() => {
        if (access) {
        navigate("/");
        }
    }, [access, navigate]);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, email, password, password2 } = formData;

        if (password !== password2) {
        toast.error("Passwords do not match");
        return;
        }

        dispatch(registerUser({ username, email, password, password2 }))
        .unwrap()
        .then(() => {
            toast.success("Registration successful!");
            navigate("/login");
        })
        .catch((err) => {
            toast.error(err || "Registration failed");
        });
    };

    return (
        <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
            >
            {loading ? "Registering..." : "Register"}
            </button>
        </form>
        </div>
    );
};

export default Register;

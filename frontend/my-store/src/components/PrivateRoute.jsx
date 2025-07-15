import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const access = useSelector((state) => state.auth.access);

    return access ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
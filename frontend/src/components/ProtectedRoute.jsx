import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (requiredRole && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;

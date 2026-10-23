import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole, disallowedRoles = [] }) => {
    const { user, isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const homePath = user?.role === "ADMIN" ? "/admin" : user?.role === "MENTOR" ? "/mentor" : "/dashboard";
    if (requiredRole && !allowedRoles.includes(user?.role)) {
        return <Navigate to={homePath} replace />;
    }
    if (disallowedRoles.includes(user?.role)) {
        return <Navigate to={homePath} replace />;
    }

    return children;
};

export default ProtectedRoute;

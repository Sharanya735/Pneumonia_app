import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Optionally: show a spinner

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return children;
};

export default RequireAuth;
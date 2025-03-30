import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check if route requires specific role
    if (roles && !roles.includes(user.role)) {
        return <Navigate to={user.redirectUrl || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
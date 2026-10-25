import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    const location = useLocation();

    // If it's a public-only page (e.g. /login, /register), logged-in users go to home
    if (publicPage) {
        return user ? <Navigate to="/" replace /> : <Outlet />
    }

    // For any protected route, user must be logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // If route requires admin or seller privileges
    if (adminOnly) {
        if (isAdmin) {
            return <Outlet />;
        }
        if (isSeller) {
            const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
            const sellerAllowed = sellerAllowedPaths.some(path => 
                location.pathname.startsWith(path)
            );
            if (sellerAllowed) {
                return <Outlet />;
            }
        }
        return <Navigate to="/" replace />
    }

    // Regular protected route (e.g. /checkout, /order-confirm) - allowed for all logged-in users
    return <Outlet />;
}

export default PrivateRoute;
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth-context';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    // If still loading, don't render anything or redirect
    if (isLoading) {
        return null;  // You can show a loading spinner here if desired
    }

    // Once loading is done, check authentication
    if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    return children;  // Render the protected component if authenticated
}

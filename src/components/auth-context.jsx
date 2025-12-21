import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token && refreshToken) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('jwtToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    const updateAccessToken = (newAccessToken) => {
        localStorage.setItem('jwtToken', newAccessToken);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, updateAccessToken }}>
            {!isLoading && children}  {/* Render children only when loading is done */}
        </AuthContext.Provider>
    );
}

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {!isLoading && children}  {/* Render children only when loading is done */}
        </AuthContext.Provider>
    );
}

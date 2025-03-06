import React, { createContext, useState, useEffect } from 'react';
import authService from '../service/AuthenService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const [token, setToken] = useState(authService.getToken());

    useEffect(() => {
        console.log("🟢 AuthContext - Token from localStorage:", token);
        console.log("🟠 AuthContext - User from localStorage:", user);

        if (!user && token) {
            console.log("🔵 Restoring session from localStorage...");
            const savedUser = authService.getUser();
            if (savedUser) {
                setUser(savedUser);
            }
        }
    }, [token]);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(authService.getUser());
            setToken(authService.getToken());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = async (response) => {
        if (response.body?.token && response.body?.user) {
            localStorage.setItem("authToken", response.body.token);
            localStorage.setItem("loggedInCustomer", JSON.stringify(response.body.user));
            setUser(response.body.user);
            setToken(response.body.token);
            window.dispatchEvent(new Event("storage"));
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);

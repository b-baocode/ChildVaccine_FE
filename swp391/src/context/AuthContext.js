import React, { createContext, useState, useContext, useEffect } from 'react';
import sessionService from '../service/sessionService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            setIsLoading(true);
            try {
                const sessionData = await sessionService.checkSession();
                if (sessionData && sessionData.user) {
                    setSessionInfo(sessionData);
                    setUser({
                        ...sessionData.user,
                        cusId: sessionData.cusId,
                        address: sessionData.address,
                        dateOfBirth: sessionData.dateOfBirth,
                        gender: sessionData.gender
                    });
                } else {
                    console.warn("Invalid session data:", sessionData);
                    logout();
                }
            } catch (error) {
                console.error("Session check failed:", error.message);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            checkSession();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (response) => {
        try {
            if (!response || !response.body) {
                throw new Error("Invalid login response");
            }

            const sessionData = response.body;
            if (sessionData && sessionData.user && sessionData.token) {
                localStorage.setItem('user', JSON.stringify(sessionData));
                localStorage.setItem('token', sessionData.token);
                setUser({
                    ...sessionData.user,
                    cusId: sessionData.cusId,
                    address: sessionData.address,
                    dateOfBirth: sessionData.dateOfBirth,
                    gender: sessionData.gender
                });
                setSessionInfo(sessionData);
                console.log("Login successful:", sessionData);
            } else {
                throw new Error("Invalid login data received");
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setSessionInfo(null);
    };

    const value = {
        user,
        sessionInfo,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// const login = async (response) => {
    //     // Extract user data from the response structure
    //     const userData = response.body.user;
    //     if (userData) {
    //         localStorage.setItem('user', JSON.stringify(userData));
    //         if (response.body.token) {
    //             localStorage.setItem('token', response.body.token);
    //         }
    //         setUser(userData);
    //     }
    // };
import React, { createContext, useState, useContext, useEffect } from 'react';
import sessionService from '../service/sessionService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const sessionData = await sessionService.checkSession();
                setSessionInfo(sessionData);
                if (sessionData.user) {
                    // Lưu toàn bộ thông tin session
                    setUser({
                        ...sessionData.user,
                        cusId: sessionData.cusId,
                        address: sessionData.address,
                        dateOfBirth: sessionData.dateOfBirth,
                        gender: sessionData.gender
                    });
                    localStorage.setItem('user', JSON.stringify(sessionData));
                }
            } catch (error) {
                logout();
            }
        };

        if (localStorage.getItem('token')) {
            checkSession();
        }
    }, []);

    const login = async (response) => {
        // Extract user data from the response structure
        const userData = response.body.user;
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            if (response.body.token) {
                localStorage.setItem('token', response.body.token);
            }
            setUser(userData);
        }
    };

    const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
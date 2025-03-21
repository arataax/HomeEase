import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

    const login = (userData) => {
        console.log('Logging in user:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Guardar en Local Storage
    };    

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



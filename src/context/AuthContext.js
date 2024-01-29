import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // Function to set user data and update localStorage
    const login = (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsSidebarVisible(true);
        console.log(isSidebarVisible, 'visible?');
    };

    // Function to clear user data and update localStorage
    const logout = () => {
        localStorage.removeItem('userData');
        setUser(null);
        setIsSidebarVisible(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isSidebarVisible }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

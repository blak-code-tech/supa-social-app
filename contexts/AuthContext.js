import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setAuth = (authUser) => {
        setUser(authUser);
    }

    const setUserData = (data) => {
        setUser({ ...data });
    }

    return (
        <AuthContext.Provider value={{ setAuth, user, setUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
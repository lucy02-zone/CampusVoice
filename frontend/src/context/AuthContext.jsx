import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        let active = true;
        if (!token) {
            return () => { active = false; };
        }

        getCurrentUser()
            .then((data) => {
                if (!active) return;
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            })
            .catch(() => {
                if (!active) return;
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                if (active) setAuthLoading(false);
            });

        return () => { active = false; };
    }, [token]);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
        setAuthLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
        setAuthLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                authLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

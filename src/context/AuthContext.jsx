import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token') || null);
	const [loading, setLoading] = useState(true);
	
	const login = (newToken, userData) => {
		localStorage.setItem('token', newToken);
		setToken(newToken);
		setUser(userData);
	};
	
	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};

    useEffect(() => {
    
        const fetchMe = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data.data);
            } catch {
                console.error("Token invalid or expired");
                logout();
            } finally {
                setLoading(false);
            }
        };
    
        fetchMe();
	}, [token]);
	

	return (
		<AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {!loading && children}
		</AuthContext.Provider>
	);
};

// creates a custom hook
export const useAuth = () => {
	return useContext(AuthContext);
};
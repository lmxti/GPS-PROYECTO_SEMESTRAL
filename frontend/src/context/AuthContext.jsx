import { createContext, useContext, useEffect } from 'react';
import { useRouter } from "next/router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider( { children }){
    const router = useRouter();
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || "" : "";
    const isAuthenticated = user ? true : false;

    useEffect(() => {
        if (!isAuthenticated) {
          router.push('/auth/login');
        }
      }, [isAuthenticated, router]);

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}
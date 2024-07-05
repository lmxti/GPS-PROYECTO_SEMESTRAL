import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider( { children }){
    const router = useRouter();
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || "" : "";
    const isAuthenticated = user ? true : false;
    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
      if (!isAuthenticated && !redirected) {
          router.push('/auth');
          setRedirected(true);
      }
  }, [isAuthenticated, redirected, router]);

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}
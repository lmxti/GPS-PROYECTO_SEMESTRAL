/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/* <---------------------- COMPONENTES -------------------------> */
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from '@/components/form/RegisterForm';

import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from "@/context/AuthContext";


const Auth = () => {
    const router = useRouter();
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);

    useEffect(() => {
        // Verificar si el usuario está autenticado después de que la página se haya cargado en el cliente
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            setUserLoggedIn(!!user); // Convierte a booleano
        }
    }, []);

    if(userLoggedIn){
        router.push("/")
    }
    

    const toggleForm  = () => {
        setShowLoginForm(!showLoginForm);
    }

    return (
        <div className={`min-h-screen ${showLoginForm ? 'bg-zinc-500' : 'bg-slate-500'}  flex justify-center items-center relative overflow-hidden`}>
            <div className="absolute w-60 h-60 rounded-xl bg-zinc-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
            <div className="absolute w-48 h-48 rounded-xl bg-zinc-300 -bottom-6 -right-10 transform rotate-12 hidden md:block"></div>
            <div className='py-12 px-12 bg-white rounded-2xl shadow-xl z-20'>
                <AnimatePresence mode='wait'>
                    {showLoginForm ? 
                    (
                        <motion.div key="login" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1 }}  exit={{ opacity: 0, y: 50 }} transition={{  ease: "easeOut", duration: 0.5 } } >
                            <LoginForm toggleForm={ toggleForm } />
                        </motion.div>
                    ) : 
                    (
                        <motion.div key="register" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} transition={{  ease: "easeOut", duration: 0.5 }} >
                            <RegisterForm toggleForm={ toggleForm } />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="w-40 h-40 absolute bg-zinc-300 rounded-full top-0 right-12 hidden md:block"></div>
            <div className="w-20 h-40 absolute bg-zinc-300 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
        </div>
    );
}

export default Auth;
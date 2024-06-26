/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/* <---------------------- COMPONENTES -------------------------> */
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from '@/components/form/RegisterForm';

import { motion, AnimatePresence } from 'framer-motion';


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
        <div className="min-h-screen  bg-slate-800 flex justify-center items-center text-black">
            <div className='py-12 px-12  bg-white rounded-2xl shadow-xl z-20'>
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
        </div>
    );
}

export default Auth;
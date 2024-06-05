/* <----------------------- FUNCIONES --------------------------> */
import { useState } from 'react';
import { useRouter } from 'next/router';

/* <----------------------- SERVICIOS  --------------------------> */
import { login } from '../../services/auth.service.js'

const LoginForm = ( { toggleForm } ) => {

    const router = useRouter();
    const [credentials, setCredentials ] = useState({ email: "", password: "" });

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setCredentials( prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("Las credenciales son: ", credentials);
            await login(credentials);
            router.push("/")

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className=''>     
            <div>
                <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
                    Inicia sesión
                </h1>
                <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
                    Inicia sesión con tu cuenta para acceder a todo el contenido de la plataforma.
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <div className="space-y-4">
                    <input type="email" name="email" placeholder="Email" required
                        onChange={handleChange} value={credentials.email}
                        className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
                    <input type="password" name="password" placeholder="Contraseña" required
                        onChange={handleChange} value={credentials.password}
                        className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
                </div>


                <div className="text-center mt-6">
                    <button className="py-3 w-64 text-xl text-white bg-purple-400 rounded-2xl">
                        Iniciar sesión
                    </button>
                </div>
            </form>

            <p className="mt-4 text-sm">
                ¿No tienes una cuenta?
                <span className="underline cursor-pointer" onClick={toggleForm}>
                    Registrate
                </span>
            </p>
        </div>
    )
}



export default LoginForm;

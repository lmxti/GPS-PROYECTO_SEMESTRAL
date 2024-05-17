import { useState } from 'react';

const RegisterForm = ({ toggleForm }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Maneja el registro del usuario
        console.log('Registrando usuario con los datos:', formData);
    };

    return (
        <div>
                <div>
                    <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
                        Regístrate
                    </h1>
                    <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
                        Regístrate con tu cuenta para acceder a todo el contenido de la plataforma.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input type="email" name="email" placeholder="Email" required
                            onChange={handleChange} value={formData.email}
                            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
                        <input type="password" name="password" placeholder="Contraseña" required
                            onChange={handleChange} value={formData.password}
                            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
                    </div>

                    <div className="text-center mt-6">
                        <button className="py-3 w-64 text-xl text-white bg-rose-400 rounded-2xl">
                            Registrarse
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-sm">
                    ¿Ya tienes una cuenta? 
                    <span className="underline cursor-pointer" onClick={toggleForm}>
                        Iniciar sesión
                    </span>
                </p>
        </div>
    );
}

export default RegisterForm;

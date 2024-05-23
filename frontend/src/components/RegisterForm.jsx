import { useState } from 'react';
import StepWizard from 'react-step-wizard';
import { register } from "../services/user.service"


const RegisterForm = ({ toggleForm }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        birthdate: '',
        gender: '',
        profilePicture: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e, fieldName) => {
        if (fieldName === 'profilePicture') {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                [fieldName]: file,
            });
        } else {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Registrando usuario con los datos:', formData);
            await register(formData);
            console.log("Registro existoso");
        } catch (error) {
            console.log(error);
        }
    };

    const StepNav = ({ currentStep, totalSteps, goToStep }) => {
        const steps = [];
        for (let i = 1; i <= totalSteps; i++) {
            steps.push(<button key={i} className={`h-3 w-3 rounded-full ${i === currentStep ? 'bg-blue-500' : 'bg-gray-300'} mx-1`} onClick={() => goToStep(i)}/>);
        }
        return ( <div className="flex justify-center mb-4">{steps}</div>);
    };

    return (
        <div className="">
            <div>
                <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Regístrate</h1>
            </div>

            <StepWizard transitions={{}} nav={<StepNav/>}>
                <Step1 formData={formData} handleChange={handleChange} />
                <Step2 formData={formData} handleChange={handleChange} />
                <Step3 formData={formData} handleFileChange={handleFileChange} handleChange={handleChange} handleSubmit={handleSubmit} />
            </StepWizard>

            <p className="mt-4 text-sm">
                ¿Ya tienes una cuenta? 
                <span className="underline cursor-pointer" onClick={toggleForm}>
                    Iniciar sesión
                </span>
            </p>
        </div>
    );
};

const Step1 = ({ formData, handleChange, nextStep }) => (
    <div className="space-y-4">
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
            Bienvenido, para poder registrarte necesitamos validar la siguiente informacion basica. 
        </p>
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} value={formData.email}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
        <input type="password" name="password" placeholder="Contraseña" required onChange={handleChange} value={formData.password}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
        <input type="text" name="username" placeholder="Nombre de Usuario" required onChange={handleChange} value={formData.username}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
        <div className="text-center mt-6 flex justify-center">
            <button type="button" onClick={nextStep} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Siguiente</button>
        </div>
    </div>
);

const Step2 = ({ formData, handleChange, nextStep, previousStep }) => (
    <div className="space-y-4">
        <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
            Necesitamos saber un poco más de ti, completa lo siguiente para ello.
        </p>
        <input type="text" name="name" placeholder="Nombre" required onChange={handleChange} value={formData.name}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />
            
        <input type="text" name="surname" placeholder="Apellido" required onChange={handleChange} value={formData.surname}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" />

        <div className='flex justify-between space-x-2'>
            <input type="date" name="birthdate" placeholder="Fecha de Nacimiento" required onChange={handleChange} value={formData.birthdate}
                className="text-xs text-center px-2 py-3  rounded-lg border w-full outline-none" />
            <select name="gender" required onChange={handleChange} value={formData.gender}
                className="text-xs text-center px-2 py-3  rounded-lg border w-full outline-none">
                <option value="">Selecciona tu género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
            </select>
        </div>
        <div className="text-center mt-6 flex justify-center space-x-4">
            <button type="button" onClick={previousStep} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Atrás</button>
            <button type="button" onClick={nextStep} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Siguiente</button>
        </div>
    </div> 
);

const Step3 = ({ formData, handleFileChange, previousStep, handleSubmit }) => (
    <div className="space-y-4">
        <p className="w-80 text-center text-sm  font-semibold text-gray-700 tracking-wide cursor-pointer">
            Por ultimo, opcionalmente puedes mostrarle al mundo como eres!
        </p>
        <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-4 border-dashed group text-center w-[200px] h-[200px] p-2">
                <div className='bg-black h-full '>
                <img 
                    className='object-cover h-full w-full'
                    src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : "https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg?t=st=1715976896~exp=1715980496~hmac=f0d56dbde22776fa13f98cc15097667c29468fc4435d2ccd292c34ef5487ddc9&w=740"} alt="Profile"
                />
                </div>
                <input type="file" className="hidden" onChange={(event) => handleFileChange(event, 'profilePicture')}/>
            </label>
        </div>

        <div className="text-center mt-6 flex justify-center space-x-4">
            <button type="button" onClick={previousStep} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Atrás</button>
            <button type="button" onClick={handleSubmit} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Registrarse</button>
        </div>


    </div> 
);

export default RegisterForm;

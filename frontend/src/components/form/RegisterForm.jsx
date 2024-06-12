/* <----------------------- MODULOS --------------------------> */
import StepWizard from 'react-step-wizard';

/* <----------------------- FUNCIONES --------------------------> */
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import { FormControl, FormGroup, InputLabel, OutlinedInput, InputAdornment, IconButton, Button, Select, MenuItem , Box } from '@mui/material';

/* <----------------------- ICONOS --------------------------> */
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

/* <----------------------- SERVICIOS  --------------------------> */
import { register } from "../../services/user.service";

const RegisterForm = ({ toggleForm }) => {
    const router = useRouter();
    const wizardRef = useRef(null);

    // Seteo de campos de formulario de registro
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        birthdate: '',
        gender: '',
        profilePicture: null,
    });

    // Seteo de campos completos en 'false' por default
    const [isStep1Valid, setIsStep1Valid] = useState(false);
    const [isStep2Valid, setIsStep2Valid] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    useEffect(() => {
        setIsStep1Valid(formData.email && formData.password && formData.username);
        setIsStep2Valid(formData.name && formData.surname && formData.birthdate && formData.gender);

    }, [formData]);

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
        console.log(formData.profilePicture);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            console.log("Registro en la plataforma existoso, redirigiendo a 'login'");
            toggleForm();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
                if (wizardRef.current) {
                    wizardRef.current.goToStep(1);
                }
            }
        }
    };

    const StepNav = ({ currentStep, totalSteps, goToStep }) => {
        const steps = [];
        for (let i = 1; i <= totalSteps; i++) {
            steps.push(<button key={i} className={`h-3 w-3 rounded-full ${i === currentStep ? 'bg-blue-500' : 'bg-gray-300'} mx-1`} onClick={() => goToStep(i)} />);
        }
        return <div className="flex justify-center mb-4">{steps}</div>;
    };

    return (
        <div className="">
            <div>
                <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Regístrate</h1>
            </div>

            <StepWizard ref={wizardRef} transitions={{}} nav={<StepNav />}>
                <Step1 formData={formData} handleChange={handleChange} isStep1Valid={isStep1Valid} showPassword={showPassword} handleClickShowPassword={handleClickShowPassword} error={error} />
                <Step2 formData={formData} handleChange={handleChange} isStep2Valid={isStep2Valid} />
                <Step3 formData={formData} handleFileChange={handleFileChange} handleChange={handleChange} handleSubmit={handleSubmit} isStep1Valid={isStep1Valid} isStep2Valid={isStep2Valid} />
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

const Step1 = ({ formData, handleChange, nextStep, isStep1Valid, showPassword, handleClickShowPassword, error }) => (
    <div>
        <p className="w-80 text-center text-sm mb-4 font-semibold text-gray-700 tracking-wide cursor-pointer">
            Bienvenido, para poder registrarte necesitamos validar la siguiente información básica.
        </p>
        <FormGroup>
            <FormControl margin='normal'>
                <InputLabel>Correo electronico</InputLabel>
                <OutlinedInput id='email' name='email' type='text' label='Correo electronico' onChange={handleChange} value={formData.email} />
            </FormControl>

            <FormControl margin='normal'>
                <InputLabel>Ingresa contraseña</InputLabel>
                <OutlinedInput id='contraseña' name='password' type={showPassword ? 'text' : 'password'} label='Ingresa contraseña' onChange={handleChange} value={formData.password}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>}
                />
            </FormControl>

            <FormControl margin='normal'>
                <InputLabel>Nombre de usuario</InputLabel>
                <OutlinedInput id='username' name='username' type='text' label='Nombre de usuario' onChange={handleChange} value={formData.username} />
            </FormControl>

            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button variant="contained" color="primary" type="button" onClick={nextStep} disabled={!isStep1Valid} className='mb-4 mt-4 py-4 normal-case'>
                Siguiente
            </Button>
        </FormGroup>
    </div>
);

const Step2 = ({ formData, handleChange, nextStep, previousStep, isStep2Valid }) => (
    <div>
        <p className="w-80 text-center text-sm  font-semibold text-gray-700 tracking-wide cursor-pointer">
            Necesitamos saber un poco más de ti, completa lo siguiente para ello.
        </p>

        <FormGroup>
            <FormControl margin='normal'>
                <InputLabel>Nombre</InputLabel>
                <OutlinedInput id='name' name='name' type='text' label='Nombre' onChange={handleChange} value={formData.name} />
            </FormControl>

            <FormControl margin='normal'>
                <InputLabel>Apellido</InputLabel>
                <OutlinedInput id='surname' name='surname' type='text' label='Apellido' onChange={handleChange} value={formData.surname} />
            </FormControl>

            <div className='flex flex-row justify-around '>
                <input type="date" name="birthdate" placeholder="Fecha de Nacimiento" required onChange={handleChange} value={formData.birthdate}
                    className="text-xs text-center px-2 py-3 w-[48%] rounded-lg border-2  outline-none " />
                <FormGroup className=' w-[48%]'>
                    <FormControl>
                        <InputLabel id="gender">Genero</InputLabel>
                        <Select labelId="gender" label="Genero" required name='gender' onChange={handleChange} value={formData.gender}>
                            <MenuItem value={"Masculino"}>Masculino</MenuItem>
                            <MenuItem value={"Femenino"}>Femenino</MenuItem>
                            <MenuItem value={"Otro"}>Otro</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>
            </div>

            <Button variant="contained" color="primary" type="button" onClick={nextStep} disabled={!isStep2Valid} className='mt-4 py-4 normal-case'>
                Siguiente
            </Button>

            <Button variant="contained" color="primary" type="button" onClick={previousStep} className='mt-4 py-4 normal-case'>
                Atrás
            </Button>
        </FormGroup>
    </div>
);

const Step3 = ({ formData, handleFileChange, previousStep, handleSubmit, isStep1Valid,  isStep2Valid  }) => (
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
                <input type="file" className="hidden" onChange={(event) => handleFileChange(event, 'profilePicture')} />
            </label>
        </div>

        <Button variant="contained" color="primary" type="button" onClick={handleSubmit} className='mt-4 py-4 normal-case w-full' disabled={ !isStep1Valid || !isStep2Valid}>
            Finalizar
        </Button>
        <Button variant="contained" color="primary" type="button" onClick={previousStep} className='mt-4 py-4 normal-case w-full'>
            Atrás
        </Button>
            {/* <button type="button" onClick={previousStep} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Atrás</button>
            <button type="button" onClick={handleSubmit} className="text-lg w-full p-4 text-white bg-gray-400 rounded-2xl">Registrarse</button> */}
    </div>
);

export default RegisterForm;

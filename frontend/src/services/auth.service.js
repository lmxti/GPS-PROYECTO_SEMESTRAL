/* <----------------------- MODULOS --------------------------> */
import axios from './root.service';
import cookies from 'js-cookie';

/* <----------------------- FUNCIONES --------------------------> */
import { jwtDecode } from 'jwt-decode';

export const login = async( { email, password } ) => {
    try {
        const response = await axios.post('auth/login', {
            email,
            password
        });

        const { status, data } = response;
        if (status === 200) {
            const { email, role, id } = await jwtDecode(data.data.accessToken);
            localStorage.setItem('user', JSON.stringify( { email, role, id } ));
            axios.defaults.headers.common[ 'Authorization'] = `Bearer ${ data.data.accessToken }`;
            cookies.set('jwt-auth', data.data.accessToken, { path: '/' });
            return true;
        }
        console.log("Has iniciado sesion.");
    } catch (error) {
        console.log("No pudiste iniciar sesion.");
        console.log(error);
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    cookies.remove('jwt-auth');
};
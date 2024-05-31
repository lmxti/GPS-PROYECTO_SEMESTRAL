/* <----------------------- MODULOS --------------------------> */
import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = 'http://localhost:3001/api/';

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        const token = cookies.get( 'jwt-auth', { path: '/'} );
        if (token) {
            config.headers.Authorization = `Bearer ${ token }`;
        }

        // Si la solicitud incluye datos de tipo FormData, establece el encabezado 'Content-Type' en 'multipart/form-data'
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const register = async (formData) => {
    try {

        return axios.post("users/createUser", formData, { headers })

    } catch (error) {
        console.log("FRONTEND: Error en user.service -> register",error);
    }
}

export const getUserInformation = async (id) => {
    try {
        return axios.get(`users/getUserByID/${id}`);
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> getUserInformation()");
    }
};

export const getUserImage = async (id) => {
    try {
        const response = await axios.get(`users/getUserImageByID/${id}`, {
            responseType: 'arraybuffer' // Indica a axios que la respuesta es un array de bytes
        });
        // Convierte los datos binarios en un base64 string
        const base64String = Buffer.from(response.data, 'binary').toString('base64');
        // Construye la URL de la imagen usando el base64 string
        const imageUrl = `data:image/jpeg;base64,${base64String}`;
        return imageUrl;
    } catch (error) {
        console.log("FRONTEND: Error en user.service -> getUserImage()", error);
    }
};
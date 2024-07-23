import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
};

export const search = async (q) => {
    try {
        const response = await axios.get(`/search?q=${q}`);
        return response.data;
    } catch (error) {
        console.error("FRONTEND: Error en search.service -> search", error);
        throw error; // Re-lanzamos el error para que pueda ser manejado por el componente que llama a esta función
    }
};
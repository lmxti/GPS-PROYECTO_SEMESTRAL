import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const register = async (formData) => {
    try {

        return axios.post("users/createUser", formData, { headers })

    } catch (error) {
        console.log(error);
    }
}
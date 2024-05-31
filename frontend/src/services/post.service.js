import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const createPost = async(postData) => {
    try {
        const response = await axios.post("/posts/createPost", postData, headers);
        return response.data;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> createPost", error);
    }
}
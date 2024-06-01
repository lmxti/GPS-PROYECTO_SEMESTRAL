import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const createPost = async(postData) => {
    try {
        return  response = await axios.post("/posts/createPost", postData, headers);
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> createPost", error);
    }
}

export const getPosts = async() => {
    try {
        const response = await axios.get("/posts/getPosts")
        return response.data
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}
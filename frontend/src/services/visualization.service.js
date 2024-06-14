import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const searchContent = async(query) => {
    try {
        const response = await axios.get('/search/search', {
            params: { query: query },
            headers: headers
        });
        return response.data;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> searchContent", error);
    }
}

export const getFollowedPosts = async (userId) => {
    try {
        const response = await axios.get(`/followed/${userId}`, headers);
        return response.data;
    } catch (error) {
        console.error("FRONTEND: Error en visualization.service -> fetchFollowedPosts", error);
        throw error; 
    }
}

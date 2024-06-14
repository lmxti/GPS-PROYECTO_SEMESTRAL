import axios from "./root.service";

export const getHashtags = async () => {
    try {
        return axios.get("/hashtags/getHashtags")
    } catch (error) {
        console.log("FRONTEND: Error en hashtag.service -> getHashtags()");
        
    }
}
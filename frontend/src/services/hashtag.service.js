import axios from "./root.service";

export const getHashtags = async () => {
    try {
        return axios.get("/hashtags/getHashtags")
    } catch (error) {
        console.log("FRONTEND: Error en hashtag.service -> getHashtags()");
        
    }
}

export const followHashtag = async (userId, hashtagId) => {
    try {
        return axios.post("/hashtags/userFollowHashtag", { userId, hashtagId });
    } catch (error) {
        console.log("FRONTEND: Error en hashtag.service -> followHashtag()");
    }
}

export const unfollowHashtag = async (userId, hashtagId) => {
    try {
        return axios.post("/hashtags/userUnfollowHashtag", { userId, hashtagId });
    } catch (error) {
        console.log("FRONTEND: Error en hashtag.service -> unfollowHashtag()");
    }
}
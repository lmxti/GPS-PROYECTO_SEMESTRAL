import axios from "./root.service"

const headers = {
    "Content-Type": "multipart/form-data",
};

export const getComments = async (postId) => {
    try{
        return axios.get(`comments/getCommentsByPost/${postId}`)
    } catch (error) {
        console.log(error);
    }
}

export const createComment = async (commentData) => {
    try{
        return axios.post("comments/createComment", commentData, headers )
    } catch (error) {
        console.log("FRONTEND: Error en comment.service -> createComment",error);
    }
}

export const deleteComment = async (commentId) => {
    try{
        return axios.delete(`comments/deleteComment/${commentId}`)
    } catch (error) {
        console.log(error);
    }
}

export const updateComment = async (commentId, commentData) => {
    try{
        return axios.put(`comments/updateComment/${commentId}`, commentData, headers)
    } catch (error) {
        console.log(error);
    }
}
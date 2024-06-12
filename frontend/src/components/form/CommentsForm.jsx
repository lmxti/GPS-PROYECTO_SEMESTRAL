import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import UserAvatar from "../common/UserAvatar.jsx";


/* Servicios y Contexto */
import { createComment } from "@/services/comments.service.js";
import { useAuth } from "@/context/AuthContext.jsx";

const CreateComments = ({ postId }) => {
  const { user } = useAuth();

  const [comment, setComment] = useState({
    userId: user.id,
    postId: postId,
    userComment: "",
    imageComment: [],
  });

  const handleInputChange = (e) => {
    setComment({
      ...comment,
      userComment: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setComment({
      ...comment,
      imageComment: e.target.files,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userComment", comment.userComment);
      formData.append("userId", comment.userId);
      formData.append("postId", comment.postId);
      Array.from(comment.imageComment).forEach((image) => {
        formData.append("imageComment", image);
      });
      await createComment(formData);
      const newCommentEvent = new CustomEvent("newComment", {
        detail: { postId },
      });
      window.dispatchEvent(newCommentEvent);
    } catch (error) {
      console.log(error);
    } finally {
      setComment({
        userId: user.id,
        postId: postId,
        userComment: "",
        imageComment: [],
      });
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex space-x-2 items-center">
          <UserAvatar userId={user.id}/> 
          <FormControl variant="outlined" className="w-full">
            <InputLabel htmlFor="userComment">Escribe un comentario</InputLabel>
            <OutlinedInput id="userComment" name="userComment" value={comment.userComment} onChange={handleInputChange} label="Escribe un comentario"
              endAdornment={
                <InputAdornment position="end">
                  <input type="file" id="imageComment" name="imageComment" style={{ display: "none" }}   onChange={(e) => handleFileChange(e) } />
                  <label htmlFor="imageComment">
                    <IconButton component="span">
                      <AddToPhotosIcon />
                    </IconButton>
                  </label>
                  <IconButton type="submit" disabled={!comment.userComment}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {comment.imageComment &&
          
            Array.from(comment.imageComment).map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} alt={`Comentario imagen (${index})`} className="w-28 h-28 p-1 bg-zinc- mt-2 shadow object-contain"
              />
            ))}
        </div>

      </form>
    </div>
  );
};

export default CreateComments;

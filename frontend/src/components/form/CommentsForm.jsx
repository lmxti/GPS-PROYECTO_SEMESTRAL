import React, { useState, useEffect, useRef  } from "react";
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

const CreateComments = ({ postId, postStatus, autoFocus  }) => {
  const { user } = useAuth();
  const inputRef = useRef(null);

  const [comment, setComment] = useState({
    userId: user.id,
    postId: postId,
    userComment: "",
    imageComment: null,
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setComment((prevComment) => ({
      ...prevComment,
      postId: postId,
    }));
  }, [postId]);

  /* Funcion para manejar el cambio en el campo de texto */
  const handleInputChange = (e) => {
    setComment((prevComment) => ({
      ...prevComment,
      userComment: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setComment((prevComment) => ({
      ...prevComment,
      imageComment: e.target.files[0],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userComment", comment.userComment);
      formData.append("userId", comment.userId);
      formData.append("postId", comment.postId);
      if (comment.imageComment) {
        formData.append("imageComment", comment.imageComment)
      }
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
        imageComment: null,
      });
    }
  };

  if (postStatus === false) {
    return (
      <div className="flex space-x-2 items-center">
        <UserAvatar userId={user.id}/> 
        <FormControl variant="outlined" className="w-full text-center">
          <OutlinedInput 
            className="bg-zinc-200"
            value="Publicación cerrada, no se permiten comentarios"
            disabled
            fullWidth
          />
        </FormControl>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
      <div className="flex space-x-2 items-center">
          <UserAvatar userId={user.id}/> 
          <FormControl variant="outlined" className="w-full">
            <InputLabel htmlFor="userComment">Escribe un comentario</InputLabel>
            <OutlinedInput 
              id="userComment" 
              name="userComment" 
              value={comment.userComment} 
              onChange={handleInputChange} 
              label="Escribe un comentario"
              inputRef={inputRef}
              endAdornment={
                <InputAdornment position="end">
                  <label>
                    <IconButton component="span">
                      <AddToPhotosIcon />
                      <input type="file" id="imageComment" name="imageComment" style={{ display: "none" }} onChange={handleImageChange} />
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
              <img
                src={URL.createObjectURL(comment.imageComment)}
                alt="image"
                className="w-full"
              />
            }
        </div>
      </form>
    </div>
  );
};

export default CreateComments;

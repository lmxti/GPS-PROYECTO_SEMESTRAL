/* <----------------------- COMPONENTES --------------------------> */
import Button from "@mui/material/Button";

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <----------------------- SERVICIOS  -----------------------> */
import { createComment } from "@/services/comments.service.js";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";

/* <----------------------- ICONOS --------------------------> */
import IconButton from '@mui/material/IconButton';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const CreateComments = ({ postId }) => {
  /* Se extrae la informacion del usuario en sesion */
  const { user } = useAuth();

  /* Se establecen los campos del comentario */
  const [comment, setComment] = useState({
    userId: user.id,
    postId: postId,
    userComment: "",
    imageComment: null,
  });

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
    console.log(postId);
  };

  const handleImageChange = (e) => {
    setComment((prevComment) => ({
      ...prevComment,
      imageComment: e.target.files[0],
    }));
    console.log(postId);
  };

  /* Funcion para enviar el comentario */
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

  /* Se retorna el componente cargado para rellenar el formulario de comentarios */
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex space-x-2">

          <input name="userComment" id="userComment" placeholder="Escribe un comentario" cols="30" rows="10" value={comment.userComment} onChange={handleInputChange}
            className="p-2 mb-2 border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-blue-500 flex-grow"
          />

          <label title="Agregar imagen" className="bg-white px-6 mb-2 flex items-center border-2 border-1-0  hover:bg-sky-500 duration-150 ease-in-out cursor-pointer">
            <AddToPhotosIcon/>
            <input type="file" name="image" id="imageComment" className="hidden" onChange={handleImageChange}/>
          </label>

          <IconButton type="submit" className="bg-white w-fit px-6 mb-2 h-fit rounded border-2 border-1-0  hover:bg-sky-500 duration-150 ease-in-out cursor-pointer">
              <SendIcon/>
          </IconButton>


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

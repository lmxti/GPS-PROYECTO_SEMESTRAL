/* <----------------------- COMPONENTES --------------------------> */
import Button from "@mui/material/Button";

/* <----------------------- FUNCIONES --------------------------> */
import { useState } from "react";

/* <----------------------- SERVICIOS  -----------------------> */
import { createComment } from "@/services/comments.service.js";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";

/* <----------------------- ICONOS --------------------------> */
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const CreateComments = ({ postId }) => {
  /* Se extrae la informacion del usuario en sesion */
  const { user } = useAuth();

  /* Se establecen los campos del comentario */
  const [comment, setComment] = useState({
    userId: user.id,
    postId: postId,
    userComment: "",
    imageComment: [],
  });

  /* Funcion para manejar el cambio en el campo de texto */
  const handleInputChange = (e) => {
    setComment({
      ...comment,
      userComment: e.target.value,
    });
  };

  /* Funcion para enviar el comentario */
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

  /* Se retorna el componente cargado para rellenar el formulario de comentarios */
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex items-stretch">
          <input
            name="userComment"
            id="userComment"
            cols="30"
            rows="10"
            value={comment.userComment}
            onChange={handleInputChange}
            className="p-2 mb-2 border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-blue-500 flex-grow"
            placeholder="Escribe un comentario"
          />
          <label
            htmlFor="imageComment"
            className="bg-white px-6 mb-2 flex items-center border-2 border-1-0 rounded-r-md hover:bg-sky-500 duration-150 ease-in-out cursor-pointer"
            title="Agregar imagen"
          >
            <AddPhotoAlternateIcon className="m-auto" />
            <input
              type="file"
              name="image"
              id="imageComment"
              onChange={(e) =>
                setComment({ ...comment, imageComment: e.target.files })
              }
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {comment.imageComment &&
            Array.from(comment.imageComment).map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt="image"
                className="w-full"
              />
            ))}
        </div>
        <Button type="submit">Comentar</Button>
      </form>
    </div>
  );
};

export default CreateComments;

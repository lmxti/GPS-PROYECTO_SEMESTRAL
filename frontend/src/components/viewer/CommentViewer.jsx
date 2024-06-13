/* <----------------------- FUNCIONES --------------------------> */
import React, { useState, useEffect } from "react";

/* <----------------------- COMPONENTES --------------------------> */
import UserAvatar from "../UserAvatar";

/* <----------------------- ICONOS --------------------------> */
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

/* <----------------------- SERVICIOS  -----------------------> */
import { getComments, deleteComment } from "@/services/comments.service.js";

const ShowComments = ({ postId, userId }) => {
  /* Se establece el estado de los comentarios */
  const [comments, setComments] = useState([]);
  const [showCount, setShowCount] = useState(3);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      if (response.data.data.data) {
        const sortedComments = response.data.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();

    const handleNewComment = () => {
      fetchComments();
    };
    window.addEventListener("newComment", handleNewComment);

    return () => {
      window.removeEventListener("newComment", handleNewComment);
    };
  }, [postId]);

  const showMoreComments = () => {
    setShowCount(showCount + 3);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      {comments && comments.length > 0 ? (
        <>
          {comments.slice(0, showCount).map((comment) => (
            <div key={comment._id} className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <UserAvatar userId={comment.userId.id} />
                  <p className="font-semibold text-slate-800">
                    {comment.userId.name}
                  </p>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-slate-700">
                    {comment.userComment}
                  </p>
                  <div className="mt-2 flex flex-wrap space-x-2">
                    {comment.imageComment.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`comment-${index}`}
                        className="object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  {comment.userId.id === userId ? (
                    <IconButton aria-label="delete" size="small" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  ) : (
                    <p>...</p>
                  )}
                  </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            {showCount < comments.length && (
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={showMoreComments}
              >
                Mostrar mas comentarios
              </button>
            )}
            {showCount > 3 && (
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setShowCount(3)}
              >
                Mostrar menos comentarios
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Esta publicacion no tiene comentarios</p>
      )}
    </div>
  );
};

export default ShowComments;

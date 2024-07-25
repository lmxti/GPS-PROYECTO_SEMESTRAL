import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import UserAvatar from "../common/UserAvatar";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import { getComments, deleteComment, updateComment } from "@/services/comments.service.js"; // Asegúrate de importar updateComment

const ShowComments = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [showCount, setShowCount] = useState(3);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const router = useRouter();

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      if (response.data.data.data) {
        const sortedComments = response.data.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } else {
        setComments([]);
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
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = (commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };

  const handleUpdateComment = async () => {
    try {
      await updateComment(editCommentId, { userComment: editCommentText, userId: userId });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === editCommentId ? { ...comment, userComment: editCommentText } : comment
        )
      );
      setEditCommentId(null);
      setEditCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="">
      {comments && comments.length > 0 ? (
        <>
          {comments.slice(0, showCount).map((comment) => (
            <div key={comment._id} className="flex justify-between space-x-2 my-2">
              <div onClick={() => router.push(`/profile/${comment.userId.id}`)}>
                <UserAvatar userId={comment.userId.id} />
              </div>
              <div className="bg-zinc-100 hover:bg-neutral-200 transition px-2 py-3 rounded w-full">
                <p className="font-semibold text-slate-800">{comment.userId.name}</p>
                {editCommentId === comment._id ? (
                  <div>
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={handleUpdateComment}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Actualizar
                      </button>
                      <button
                        onClick={() => {
                          setEditCommentId(null);
                          setEditCommentText("");
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-800">{comment.userComment}</p>
                )}
                <div className="mt-2 flex flex-wrap space-x-2 ml-211">
                  {comment.imageComment.map((image, index) => (
                    <img key={index} src={image} alt={`comment-${index}`} className="w-32 h-32 object-cover rounded-md" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                {comment.userId.id === userId && (
                  <>
                    {editCommentId === comment._id ? (
                      <IconButton aria-label="cancel-edit" size="small" onClick={() => setEditCommentId(null)}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    ) : (
                      <IconButton aria-label="edit" size="small" onClick={() => handleEditComment(comment._id, comment.userComment)}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    )}
                    <IconButton aria-label="delete" size="small" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center text-center uppercase font-light text-sm">
            {showCount < comments.length && (
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={showMoreComments}
              >
                <ExpandMoreIcon />
                Mostrar comentarios
              </button>
            )}
            {showCount > 3 && (
              <button className="text-red-300 hover:text-red-500" onClick={() => setShowCount(3)}>
                <ExpandLessIcon />
                Ocultar comentarios
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-center uppercase font-light text-sm text-zinc-500 pt-4">
          sin comentarios
        </p>
      )}
    </div>
  );
};

export default ShowComments;

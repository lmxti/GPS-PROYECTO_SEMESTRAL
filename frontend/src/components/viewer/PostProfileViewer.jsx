/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI -------------------> */
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

/* <----------------------- ICONOS UI --------------------------> */
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IosShareIcon from '@mui/icons-material/IosShare';
import EditIcon from '@mui/icons-material/Edit'; // Añadido para el icono de edición

/* <------------------- COMPONENTES COMMON ---------------------> */
import UserAvatar from "../common/UserAvatar.jsx";
import SkeletonPost from "../common/SkeletonPost.jsx";

/* <------------------- COMPONENTES VIEWER ---------------------> */
import CommentForm from "../form/CommentsForm";
import CommentViewer from "./CommentViewer";

/* <------------------- COMPONENTES MODAL ----------------------> */
import ImageModal from "../modal/ImageModal";

/* <----------------------- SERVICIOS  -------------------------> */
import { getUserPosts, updatePost, deletePost, markInteraction } from "@/services/post.service";

function PostProfileViewer({ id, userId }) {
  // Seteo de publicaciones
  const [posts, setPosts] = useState([]);
  // Seteo de estado de carga por default `true`
  const [loading, setLoading] = useState(true);
  // Estado para el ID de la publicación en edición
  const [editingPostId, setEditingPostId] = useState(null);
  // Estado para los datos editados de la publicación
  const [editedPost, setEditedPost] = useState({ title: "", description: "" });
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  // Router de Next.js
  const router = useRouter();

  const getDataPosts = async () => {
    try {
      const response = await getUserPosts(id);
      setPosts(response.data.data);
    } catch (error) {
      console.error("PostProfileViewer -> getDataPosts: Error get posts", error);
    } finally {
      setLoading(false);
    }
  };

  // <--------- MANEJO DE FECHAS DE PUBLICACION --------->
  const formatRelativeDate = (dateString) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // <--------- MANEJO DE ELIMINACION DE PUBLICACION --------->
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("PostProfileViewer -> handleDeletePost: Error deleting post ", error);
    }
  };



  // <--------- MANEJO DE INTERACCION CON PUBLICACION --------->
  const handleReaction = async (postId, reactionType) => {
    try {
      const response = await markInteraction(postId, { id: userId, type: reactionType });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === response.data._id ? response.data : post
        )
      );
      getDataPosts();
    } catch (error) {
      console.error("Error marking interaction:", error);
    }
  };

  // <--------- RENDER DE BOTONES DE INTERACCION DE PUBLICACION --------->
  const renderInteractionButton = (post, reactionType) => {
    const isReacted = post.interactions.some((interaction) => interaction.user === userId && interaction.type === reactionType);
    const count = post.interactions.filter(interaction => interaction.type === reactionType).length;
    return (
      <Button className={`text-black text-xs sm:gap-2 px-3 hover:bg-zinc-300 ${reactionType === 'helpful' ? 'sm:rounded-l-full' : 'sm:rounded-r-full'} ${isReacted ? "bg-zinc-300" : ""}`}
        onClick={() => handleReaction(post._id, reactionType)}
      >
        {reactionType === 'helpful' ? <ThumbUpIcon className="text-black text-sm sm:text-lg" /> : <ThumbDownIcon className="text-black text-sm sm:text-lg" />} ({count})

      </Button>
    );
  };

  // <--------- RENDER DE FORMULARIO DE EDICION DE PUBLICACION --------->
  const renderEditForm = (post) => (
    <div className="flex flex-col mt-4 mb-6">
      {isEditingLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <input type="text" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} className="p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-zinc-400" />
          <textarea value={editedPost.description} rows="4" onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                    className="w-full p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-zinc-400"
          />
          <div className="flex justify-end space-x-2">
            <Button className="bg-zinc-300 normal-case" onClick={() => handleSaveEdit(post._id)}>Guardar</Button>
            <Button className="bg-zinc-300 normal-case" onClick={() => setEditingPostId(null)}>Cancelar</Button>
          </div>
        </>
      )}
    </div>
  );
  

  // <--------- MANEJO DE EDICION DE PUBLICACION --------->
  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditedPost({ title: post.title, description: post.description });
  };

  const handleSaveEdit = async (postId) => {
    setIsEditingLoading(true);
    try {
      await updatePost(postId, editedPost);
      setPosts(posts.map(post => post._id === postId ? { ...post, ...editedPost } : post));
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsEditingLoading(false);
    }
  };
  

  const showPosts = () => {
    return posts.map((post) => (
      <div key={post._id} className={`max-w-3xl mx-auto bg-zinc-50 shadow-md rounded-lg overflow-hidden my-4 p-4 text-left border`}>

        <div className="flex w-full items-center justify-between border-b pb-3">

          <div className="flex items-center space-x-3" onClick={() => router.push(`/profile/${post.author.id}`)}>
            <UserAvatar userId={post.author.id} />
            <div>
              <p className="text-lg font-bold text-slate-700 text-left">{post.author.name}</p>
              <p className="text-xs text-neutral-500">Publicado {formatRelativeDate(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {post.author.id === userId ? (
              <>
                <IconButton aria-label="edit" size="small" onClick={() => handleEditPost(post)}>
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton aria-label="delete" size="small" onClick={() => handleDeletePost(post._id)}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </>
            ) : (
              <p>...</p>
            )}
          </div>
        </div>

        {editingPostId === post._id ? (
          renderEditForm(post)
        ) : (
          <div className="mt-4 mb-6">
            <div className="mb-3 text-xl font-bold">{post.title}</div>
            <div className="text-sm text-neutral-600">{post.description}</div>
          </div>
        )}

        <ImageModal images={post.images} />
        <div className="flex flex-wrap border-b pb-3 pt-4 space-x-2">
          {post.hashtags.map((hashtag, index) => (
            <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.name}</button>
          ))}
        </div>

        <div className="p-0 sm:px-4 py-4 flex justify-between">
          <div className="flex sm:space-x-4 space-x-1">

            <div className="bg-zinc-200 sm:rounded-full flex">
              {renderInteractionButton(post, "helpful")}
              {renderInteractionButton(post, "nothelpful")}
            </div>

            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black sm:rounded-full">
              <CommentIcon />
            </Button>

            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black sm:rounded-full text-xs normal-case px-4 font-bold">
              <IosShareIcon />
              <span className="hidden sm:block">Compartir</span>
            </Button>
          </div>

          <div>
            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black sm:rounded-full">
              <BookmarkIcon />
            </Button>
          </div>

        </div>
        <div className="flex-wrap border-b pb-3 ">
          <CommentForm postId={post._id} />
        </div>

        <div className="px-4 py-2">
          <CommentViewer postId={post._id} userId={userId} />
        </div>


      </div>
    ))
  };

  useEffect(() => {
    getDataPosts();
  }, [id]);

  return (
    <div>
      {loading ? <SkeletonPost /> : (Array.isArray(posts) && posts.length > 0 ? showPosts() : <SkeletonPost count={1} />)}
    </div>
  );
}

export default PostProfileViewer;

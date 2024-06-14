/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

/* <----------------------- ICONOS --------------------------> */
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';

/* <----------------------- SERVICIOS  -----------------------> */
import { getPosts, deletePost, markInteraction } from "@/services/post.service";



import ImageModal from "../modal/ImageModal";
import CommentViewer from "./CommentViewer";
import CommentForm from "../form/CommentsForm";

import UserAvatar from "../UserAvatar.jsx";


const PostViewer = ( {userId} ) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga

  const getDataPosts = async () => {
    try {
      const response = await getPosts();
      if (response.data.data) {
        const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        console.log(sortedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); 
    }
  };

  const formatRelativeDate = (dateString) => {
    // Conversion de cadena de fecha en un objeto de tipo 'Date'
    const date = parseISO(dateString);
    // Retorno de diferencia relativa a fecha actual (suffix, locale marca el idioma)
    return formatDistanceToNow(date, { addSuffix: true, locale: es }); // Retorna la diferencia relativa con la fecha actual
  };

  const showSkeletons = () => (
    <div >
      {Array.from(new Array(3)).map((_, index) => (
        <div key={index} className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4 p-4">

          <div className="flex w-full items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circular" width={45} height={40} />
              <Skeleton variant="text" width={250} />
            </div>

          <div className="flex items-center space-x-8">
              <Skeleton variant="text" width={50} />
          </div>
        </div>


          <div>
            <Skeleton variant="rectangular" width={'100%'}  height={200} />
          </div>
          

          <div className="px-4 py-2">
            <div className="flex space-x-4 md:space-x-8">
              <Skeleton variant="rounded" width={200} height={40} />
              <Skeleton variant="rounded" width={200} height={40} />
              <Skeleton variant="rounded" width={150} height={40} />
              <Skeleton variant="rounded" width={150} height={40} />

            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));

    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      // Llama a markInteraction para enviar la interacción del usuario al servidor
      const response = await markInteraction(postId, { id: userId, type: reactionType });
  
      // Actualiza el estado local de las publicaciones con la respuesta del servidor
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


  const renderInteractionButton = (post, reactionType, buttonText) => {
    const isReacted = post.interactions.some((interaction) => interaction.user === userId && interaction.type === reactionType );
    const count = post.interactions.filter(interaction => interaction.type === reactionType).length;
  
    return (
      <Button onClick={() => handleReaction(post._id, reactionType)}
        className={`rounded-lg border px-3 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-900 text-white ${isReacted ? "bg-sky-900" : "bg-sky-600"}`}
      >
        {buttonText === 'Útil' ?<TaskAltIcon/> : <RemoveCircleOutlineIcon/>}
        {buttonText} ({count})
      </Button>
    );
  };
  
  



  const showPosts = ( ) => {
    return posts.map((post) => (
      <div key={post._id} className={`max-w-3xl mx-auto bg-zinc-100 shadow-lg rounded-lg overflow-hidden my-4 p-4`}>

        <div className="flex w-full items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-3">
            <UserAvatar userId={post.author.id} />
            <div>
              <p className="text-lg font-bold text-slate-700">{post.author.name}</p>
              <p className="text-xs text-neutral-500">Publicado {formatRelativeDate(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {/* Aca van los botones de editar, o mas opciones */}
            {post.author.id === userId ? (
              <IconButton aria-label="delete" size="small" onClick={() => handleDeletePost(post._id)}>
                    <DeleteIcon fontSize="inherit" />
              </IconButton>
            ) : (
              <p>...</p>
            )}
          </div>
        </div>

        <div className="mt-4 mb-6">
          <div className="mb-3 text-xl font-bold">{post.title}</div>
          <div className="text-sm text-neutral-600">{post.description}</div>
        </div>

        <ImageModal images={post.images} />

        <div className="flex flex-wrap border-b pb-3 pt-4">
          {post.hashtags.map((hashtag, index) => (
            <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.name}</button>
          ))}
        </div>

        <div className="px-4 py-2 flex justify-between">
          <div className="flex space-x-4 ">

          {renderInteractionButton(post, "helpful", "Útil")}
          {renderInteractionButton(post, "nothelpful", "No útil")}
          <Button className="bg-sky-600 hover:bg-sky-900 text-white">
            <CommentIcon/>
          </Button>
          </div>

          <div>
            <Button className="bg-sky-600 hover:bg-sky-900 text-white">
              <BookmarkIcon/>
            </Button>
          </div>

        </div>

        
        <div className="flex-wrap border-b pb-3 pt-4">
          <CommentForm postId={post._id} />
        </div>

        <div className="px-4 py-2">
            <CommentViewer postId={post._id} userId={userId}/>
        </div>

      </div>
    ));
  };

  useEffect(() => {
    getDataPosts();
  }, []);

  return (
    <div>
      {loading ? showSkeletons() : (Array.isArray(posts) && posts.length > 0 ? showPosts() : showSkeletons()  )}
    </div>
  );
};

export default PostViewer;

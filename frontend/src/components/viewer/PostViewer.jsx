/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI -------------------> */
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
/* <----------------------- ICONOS UI --------------------------> */
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IosShareIcon from '@mui/icons-material/IosShare';

/* <------------------- COMPONENTES COMMON ---------------------> */
import UserAvatar from "../common/UserAvatar.jsx";
import SkeletonPost from "../common/SkeletonPost.jsx";


/* <------------------- COMPONENTES VIEWER ---------------------> */
import CommentForm from "../form/CommentsForm";
import CommentViewer from "./CommentViewer";

/* <------------------- COMPONENTES MODAL ----------------------> */
import ImageModal from "../modal/ImageModal";

/* <----------------------- SERVICIOS  -------------------------> */
import { getPosts, deletePost, markInteraction } from "@/services/post.service";


const PostViewer = ( { userId } ) => {
  
  const router = useRouter();
  // Seteo de publicaciones
  const [posts, setPosts] = useState([]);
  // Seteo de estado de carga por default `true`
  const [loading, setLoading] = useState(true);


  const getDataPosts = async () => {
    try {
      const response = await getPosts();
      if (response.data.data) {
        const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
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
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
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
    const isReacted = post.interactions.some((interaction) => interaction.user === userId && interaction.type === reactionType );
    const count = post.interactions.filter(interaction => interaction.type === reactionType).length;
    return (
      <Button className={`text-black text-xs gap-2 px-3 hover:bg-zinc-300 ${reactionType === 'helpful' ? 'rounded-l-full' :'rounded-r-full'} ${isReacted ? "bg-zinc-300" : ""}`}
              onClick={() => handleReaction(post._id, reactionType)}
      >
        {reactionType === 'helpful' ? <ThumbUpIcon className="text-black"/> : <ThumbDownIcon className="text-black"/>} ({count})
        
      </Button>
    );
  };
  
  
  const showPosts = ( ) => {
    return posts.map((post) => (
      <div key={post._id} className={`max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4 p-4`}>

        <div className="flex w-full items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-3" onClick={()=> router.push(`/profile/${post.author.id}`)}>
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

        <div className="flex flex-wrap border-b pb-3 pt-4 space-x-2">
          {post.hashtags.map((hashtag, index) => (
            <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.name}</button>
          ))}
        </div>

        <div className="p-0 sm:px-4 py-4 flex justify-between">
          <div className="flex space-x-2 ">

            <div className="bg-zinc-200 rounded-full flex">
              {renderInteractionButton(post, "helpful",)}
              {renderInteractionButton(post, "nothelpful")}
            </div>

            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black rounded-full">
              <CommentIcon/>
            </Button>

            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black text-xs normal-case px-4 font-bold rounded-full">
                <IosShareIcon/>
                <span className="hidden sm:block">Compartir</span>
            </Button>
          </div>

          <div>
            <Button className="bg-zinc-200 hover:bg-zinc-300 text-black rounded-full">
              <BookmarkIcon/>
            </Button>
          </div>

        </div>

        
        <div className="flex-wrap border-b pb-3 ">
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
      {loading ? <SkeletonPost count={3}/>: (Array.isArray(posts) && posts.length > 0 ? showPosts() :  <SkeletonPost count={3}/>  )}
    </div>
  );
};

export default PostViewer;

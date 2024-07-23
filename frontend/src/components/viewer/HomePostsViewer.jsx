/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <------------------- COMPONENTES COMMON ---------------------> */
import PostsCommonViewer from "../common/PostsCommonViewer.jsx";

/* <----------------------- SERVICIOS  -------------------------> */
import { getPostsFollowed } from "@/services/post.service";

const HomePostsViewer = ({ userId }) => {
  // Seteo de datos de solicitud de publicaciones
  const [homePosts, setHomePosts] = useState([]);
  const [options, setOptions] = useState({
      show_images: true,
      show_hashtags: true,
      show_interactions: true,
      show_icon_comments: true,
      create_comments: true,
      show_comments: true,
      show_icon_share: true,
      show_icon_save_post: true,
  });
  // Seteo de variable de actualizacion de datos
  const [update, setUpdate] = useState(false);
      // Funcion encargada de cambiar el estado de variable de actualizacion
      const updatePosts = () => {
        setUpdate(!update);
  };
  
  useEffect(() => {
    getHomePosts();
  }, [update]);
  
  const getHomePosts = async () => {
    try {
      const response = await getPostsFollowed(userId);
      console.log(response.data.data);
      setHomePosts(response.data.data);
    } catch (error) {
      console.log("HomePostsViewer -> getHomePosts: Error get posts", error);
    }
  }
  if(homePosts.length === 0){
    return (
      <div className="text-center text-xs mt-8">
            <p>No sigues a nadie, prueba encontrar contenido en explorar :-)</p>
        </div>
    )
  }
  

  
  return <PostsCommonViewer userId={userId} data={homePosts} options={options} updatePosts={updatePosts} />
         
};

export default HomePostsViewer;

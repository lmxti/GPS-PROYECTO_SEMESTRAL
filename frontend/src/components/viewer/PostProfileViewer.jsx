/* <----------------------- FUNCIONES ---------------------------> */
import { useState, useEffect } from "react";

/* <------------------- COMPONENTES COMMON ---------------------> */
import PostsCommonViewer from '../common/PostsCommonViewer';


/* <----------------------- SERVICIOS  -------------------------> */
import { getUserPosts } from "@/services/post.service";


function UserPostsViewer({ id, userId }) {
    // Seteo de datos de solicitud de publicaciones
    const [userPosts, setUserPosts] = useState([]);
    // Opciones para mostrar
    const [options, setOptions] = useState({
      show_images: true,
      show_hashtags: true,
      show_interactions: true,
      show_icon_comments: true,
      create_comments: true,
      show_comments: true,
      show_icon_share: true,
      show_icon_save_post: true,
     })
    // Seteo de variable de actualizacion de datos
    const [update, setUpdate] = useState(false);
    // Funcion encargada de cambiar el estado de variable de actualizacion
    const updatePosts = () => {
      setUpdate(!update);
    };

    // Solicitud de datos de publicaciones de usuario
    const getUserPostsData = async () => {
      try {
          const response = await getUserPosts(id);
          setUserPosts(response.data.data);
      } catch (error) {
          console.error("UserPostsViewer -> getDataPosts: Error get posts", error);
      }; 
    }
    useEffect( () =>{
      getUserPostsData();
    }, [update]);

    if(userPosts.length === 0){
      return (
          <div className="text-center text-xs">
              Aún no has hecho publicaciones
          </div>
      )
    }

    return (
      <PostsCommonViewer userId={userId} data={userPosts} options={options} updatePosts={updatePosts}/>
    )


}
export default UserPostsViewer;

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";


import PostsCommonViewer from '../common/PostsCommonViewer';


/* <----------------------- SERVICIOS  -------------------------> */
import { getSharedPosts } from "@/services/post.service";


export default function SharedPostsViewer( { id, userId} ){
    // Seteo de datos de solicitud de publicaciones
    const [sharedPost, setSharedPost] = useState([]);
    // Opciones para mostrar
    const [options, setOptions] = useState({
        show_images: true,
        show_hashtags: true,
        show_interactions: true,
        show_icon_comments: false,
        create_comments: false,
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

    const getSharedPostsData = async () => {
        try {
            const response = await getSharedPosts(id);
            console.log(response.data.data);
            setSharedPost(response.data.data)
        } catch (error) {
            console.log("SharedPostsViewer -> getSharedPosts: Error get posts", error);
        }
    }

    useEffect( () => {
        getSharedPostsData();
    }, [update]);

    if(sharedPost.length === 0){
        return (
            <div className="text-center text-xs">
                Aún no has compartido publicaciones
            </div>
        )
      }


    return (
        <PostsCommonViewer userId={userId} data={sharedPost} options={options} updatePosts={updatePosts}/>
    )
}
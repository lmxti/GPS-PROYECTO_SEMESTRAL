/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

import PostsCommonViewer from '../common/PostsCommonViewer';

/* <----------------------- SERVICIOS  -------------------------> */
import { getUserFavoritePosts } from "@/services/post.service";

/**
 * @description - Funcion que obtiene publicaciones guardadas de un usuario y las renderiza en el componente `PostsCommonViewer`.
 * @param {userId} -  Identificador de usuario actual
 * 
 */
export default function SavedPostsViewer( { userId }) {
    // Seteo de datos de solicitud de publicaciones
    const [savedPosts, setSavedPosts] = useState([]);
    // Opciones para mostrar
    const [options, setOptions] = useState({
        show_images: true,
        show_hashtags: true,
        show_interactions: false,
        show_icon_comments: false,
        create_comments: false,
        show_comments: false,
        show_icon_share: true,
        show_icon_save_post: true,
    });
    // Seteo de variable de actualizacion de datos
    const [update, setUpdate] = useState(false);
    // Funcion encargada de cambiar el estado de variable de actualizacion
    const updatePosts = () => {
        setUpdate(!update);
    };

    const getSavedPosts = async () => {
        try {
            const response = await getUserFavoritePosts(userId);
            setSavedPosts(response.data.data);
        } catch (error) {
            console.error("SavedPostsViewer -> SavedPostsViewer: Error get posts", error);
        }
    };

    useEffect(() => {
        getSavedPosts();
    }, [update]);

    if(savedPosts.length === 0){
        return (
            <div className="text-center text-xs">
                Aún no tienes publicaciones guardadas
            </div>
        )
    }

    return (
        <PostsCommonViewer userId={userId} data={savedPosts} options={options} updatePosts={updatePosts} />
    );
}

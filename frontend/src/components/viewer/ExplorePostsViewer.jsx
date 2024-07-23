/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <------------------- COMPONENTES COMMON ---------------------> */
import PostsCommonViewer from "../common/PostsCommonViewer.jsx";

/* <----------------------- SERVICIOS  -------------------------> */
import { getPosts } from "@/services/post.service";

const ExplorePostsViewer = ({ userId }) => {
    // Setero de datos de solicitud de publicaciones
    const [explorePosts, setExplorePosts] = useState([]);
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
        getExplorePosts();
    }, [update]);

    const getExplorePosts = async () => {
        try {
            const response = await getPosts();
            console.log(response.data.data);
            setExplorePosts(response.data.data);
        } catch (error) {
            console.log("ExplorePostsViewer -> getExplorePosts: Error get posts", error);
        }
    }

    return <PostsCommonViewer userId={userId} data={explorePosts} options={options} updatePosts={updatePosts} />
}

export default ExplorePostsViewer;
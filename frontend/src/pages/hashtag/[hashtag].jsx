/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';

/* <------------------- COMPONENTES COMMON ---------------------> */
import PostsCommonViewer from "../../components/common/PostsCommonViewer.jsx";

/* <------------------------ CONTEXTO --------------------------> */
import { useAuth } from "@/context/AuthContext";

/* <--------------------- COMPONENTES NAV ----------------------> */
import NavBar from "@/components/nav/NavBar";

/* <----------------------- SERVICIOS  -------------------------> */
import { getPostsByHashtag } from "@/services/post.service";

export default function Hashtag () {
    const router = useRouter();
    // Desectructuracion datos de usuario que esta navegando (user.id).
    const { user } = useAuth();
    // Desestructuracion de identificador de hashtag y asignacion en variable `hashtagId`
    // const { hashtag: hashtagId } = router.query;
    // Seteo de datos de solicitud de publicaciones de hashtag
    const [postsHashtags, setPostsHashtags] = useState([]);

    // Seteo de estado de carga de datos, por default cargando.
    const [isLoading, setIsLoading] = useState(true);
    // Seteo de variable de actualizacion de datos
    const [update, setUpdate] = useState(false);

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
    
    const fetchPostsHashtag = async() =>{
        if (!router.isReady) return; // Asegúrate de que el router esté listo
        const { hashtag: hashtagId } = router.query;
        try{
            const response = await getPostsByHashtag(hashtagId);
            console.log(response.data.data);
            setPostsHashtags(response.data.data);
            setIsLoading(false);
        } catch(error){
            console.log("FRONTEND: Error en Post -> fetchPostsHashtag() -> hashtagId:", hashtagId, error);
        }
    }
    // Funcion encargada de cambiar el estado de variable de actualizacion
    const updatePosts = () => {
        setUpdate(!update);
    };

    useEffect(() => {
        fetchPostsHashtag();
    }, [update]);


    /*<------------------- EFECTOS DE ACTUALIZACIÓN------------------->*/
    useEffect(() => {
        fetchPostsHashtag();
    }, [router.query.hashtag, router.isReady]); 

    if (isLoading) return <div>Loading...</div>;
    
    return (
        <>
            <NavBar userId={user.id}/>
                <PostsCommonViewer userId={user.id} data={postsHashtags} options={options} updatePosts={updatePosts} />
        </>
    )
}

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect, use } from "react";
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
    // Desestructuracion de identificador de hashtag y asignacion en variable `id`.
    const { hashtag: id} = router.query;

    const [posts, setPosts] = useState([]);
    const [hashtag, setHashtag] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
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
    });
    // Seteo de variable de actualizacion de datos
    const [update, setUpdate] = useState(false);
    // Funcion encargada de cambiar el estado de variable de actualizacion
    const updatePosts = () => {
        setUpdate(!update);
    };

  /*<------------------------- SOLICITUDES HTTP------------------------->*/
    const fetchPosts = async() =>{
        try {
            const response = await getPostsByHashtag(id);
            setPosts(response.data.data.posts)
            setHashtag(response.data.data.hashtag); 
        } catch (error) {
            console.log("FRONTEND: Error en [Hashtag] -> fetchPosts() -> id:", id, error);
        }
    }
  /*<------------------- EFECTOS DE ACTUALIZACIÓN------------------->*/
    useEffect( ()=> {
        if (id) {
            fetchPosts();
        }
    }, [id]);

    useEffect( () => {
        fetchPosts();
    }, [update]);


    return (
        <>
            <NavBar userId={user.id}/>
            <div className="max-w-3xl mx-auto my-4 p-8 flex justify-between items-center bg-zinc-500 rounded shadow-md select-none">
                <h2 className="text-4xl font-semibold text-zinc-200 hover:text-zinc-50 flex">
                    <span className="font-bold tracking-wider">#</span>{hashtag.nameHashtag}
                </h2>
                <div className="text-right text-zinc-200 text-xl">
                    <p>
                        {posts 
                            ? <p className="font-bold tracking-wider hover:text-zinc-50">Publicaciones: <span className="font-normal">{posts.length}</span></p> 
                            : <p>0 publicaciones</p>}
                    </p>
                    <p>
                        {hashtag.followedBy 
                            ? <p className="font-bold tracking-wider hover:text-zinc-50">Seguidores: <span className="font-normal">{hashtag.followedBy.length}</span></p>
                            : 'Seguidores: 0 '}
                    </p>
                </div>
            </div>
            <PostsCommonViewer userId={user.id} data={posts} options={options} updatePosts={updatePosts} />
        </>
    )
}

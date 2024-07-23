/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI -------------------> */
import Button from '@mui/material/Button';

/* <----------------------- ICONOS UI --------------------------> */
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';

/* <------------------- COMPONENTES COMMON ---------------------> */
import UserAvatar from "./UserAvatar.jsx";
import ImageModal from '../modal/ImageModal.jsx';

/* <------------------- COMPONENTES VIEWER ---------------------> */
import CommentForm from "../form/CommentsForm.jsx";
import CommentViewer from "../viewer/CommentViewer.jsx";
import SkeletonPost from "./SkeletonPost.jsx";

/* <------------------- COMPONENTES FORM ---------------------> */
import ReportForm from "../../components/form/ReportForm.jsx";

/* <----------------------- SERVICIOS  -------------------------> */
import { markInteraction, savePostAsFavorite, getSharedSavedPosts, sharePost } from "@/services/post.service";


export default function PostsCommonViewer({userId, data, options, updatePosts  }) {
    // Inicialización de Hook useRouter en `router` para manejar navegación.
    const router = useRouter();
    // Seteo de estado de posts inicializado con la data recibida.
    const [posts, setPosts] = useState(data);
    // Seteo de estado de listado de publicaciones guardadas y compartidas de usuario
    const [sharedSavedPosts, setSharedSavedPosts] = useState({});

    /*<------------------------- SOLICITUDES HTTP------------------------->*/
    // Funcion encargada de obtener las publicaciones guardadas/compartidas de usuario (userId)
    const sharedSavedData = async () =>{
        try {
            const response = await getSharedSavedPosts(userId);
            setSharedSavedPosts(response.data.data)
        } catch (error) {
            console.log("Error en sharedSavedData", error);
        }
    }

    /*<----------------- MANEJO DE CLICK BOTON `COMENTAR`----------------->*/
        // Variable de referencia de formulario de comentarios para calcular posicion en "scrollToComments".
        const commentFormRefs = useRef({});
        // Variable id de referencia de caja de comentarios `CommentForm` enfocada, por default: null
        const [focusedCommentId, setFocusedCommentId] = useState(null);

        // Funcion encargada de enfocar la caja/input para crear un comentario
        const scrollToComments = (postId) => {
            if (commentFormRefs.current[postId]) {
                // Desplazamiento vertical ajustado al "33%"
                const yOffset = -window.innerHeight / 3;
                // Obtencion del elemento del DOM utilizando la referencia almacenada en `commentFormRefs.current[postId]`
                const inputComment = commentFormRefs.current[postId];
                /* Calculo de posicion absoluta del elemento en relacion a la "ventana actual" y ajustando desplazamiento 
                en base a la posicion actual de la pagina "window.pageYOffset"*/
                const position_y = inputComment.getBoundingClientRect().top + window.pageYOffset + yOffset;
                // Ejecución de desplazamiento suave (smooth) hacia la posicion calculada `position_y`
                window.scrollTo({top: position_y, behavior: 'smooth'});
                // Enfoque de formulario de comentario, correspondiente al `postId` seleccionado, despues de 0,5 segundos.
                setTimeout(() => setFocusedCommentId(postId), 500);
            }
        };
        useEffect(() => {
            // Si focusedCommentId tiene un valor distinto a null
            if (focusedCommentId) {
                // Reestablecimiento a `null`, en otras palabras el formulario de comentarios pierde el enfoque
                const timer = setTimeout(() => setFocusedCommentId(null), 100);
                // Limpieza de temporizador para evitar problemas de memoria/fugas.
                return () => clearTimeout(timer);
            }
        }, [focusedCommentId]);

    /*<----------------- FORMATEO DE FECHAS DE PUBLICACIÓN -----------------> */
        const formatRelativeDate = (dateString) => {
            const date = parseISO(dateString);
            return formatDistanceToNow(date, { addSuffix: true, locale: es });
        };

    /*<------------------- INTERACCIONES DE PUBLICACIÓN ------------------->*/
        /* Funcion encargada de enviar solicitud para marcar interaccion de publicacion, luego actualiza el
        estado de posts utilizando setPosts y mapeando sobre prevPosts para reemplazar la interaccion de la 
        publicación correspondiente, al llamar updatePosts() se reflejan los cambios*/
        const handleReaction = async (postId, reactionType) => {
            try {
                const response = await markInteraction(postId, { id: userId, type: reactionType });
                setPosts((prevPosts) => prevPosts.map((post) =>
                    post._id === response.data._id ? response.data : post
                ));
                updatePosts();
            } catch (error) {
                console.error("Error marking interaction:", error);
            }
        };
        /* Funcion que genera un boton de interaccion de publicación a según los parametros que reciba, tambien
        refleja el estado marcado en la publicación */
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

    /*<------------------- GUARDADO DE PUBLICACIÓN ------------------->*/
        const handleSavePost = async(postId, userId) =>{
            try {
                await savePostAsFavorite(postId, userId);
                sharedSavedData();
                updatePosts();
            } catch (error) {
                console.error("Error saving post:", error);
            }
        }
        
        const isPostSaved = (postId) => {
            return sharedSavedPosts.savedPosts && sharedSavedPosts.savedPosts.includes(postId);
        };

    /*<------------------- COMPARTIR PUBLICACIÓN ------------------->*/
        const handleSharePost = async(postId, userId) =>{
            try {
                await sharePost(postId, userId);
                sharedSavedData();
                updatePosts();
            } catch (error) {
                console.error("Error sharing post:", error);
            }
        }

        const isPostShared = (postId) =>{
            return sharedSavedPosts.sharedPosts && sharedSavedPosts.sharedPosts.includes(postId);
        }

    /*<------------------------- FILTRO DE ORDEN ------------------------->*/
        const [sortType, setSortType] = useState('date');
        const [sortedPosts, setSortedPosts] = useState([]);
        useEffect(() => {
            let sortedArray = [...posts];
            // Ordenar por fecha más reciente
            if (sortType === 'date') {
                sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            } else 
            // Ordenar por más comentados
            if (sortType === 'comments') {
                sortedArray.sort((a, b) => b.comments.length - a.comments.length);
            }
            setSortedPosts(sortedArray);
        }, [posts, sortType]);
    
        if (!sortedPosts) {
            return (
                <SkeletonPost count={4}/>
            )
        }

    /*<------------------- EFECTOS DE ACTUALIZACIÓN------------------->*/
        // CEfecto que se ejecuta cuando cambia la información o mejor dicho la data que recibe el componente, esto para actualizar las publicaciones mostradas.
        useEffect(() => {
            setPosts(data);
            sharedSavedData();
        }, [data]);

    // Caso 1: No hay publicaciones para mostrar, se ven skeleton post por default
    if(!posts){
        return (
            <SkeletonPost count={4}/>
        )
    }

    return (
        <div>
            {sortedPosts.map((post) => (
            <div key={post._id} className={`max-w-3xl mx-auto bg-zinc-50 shadow-md rounded-lg overflow-hidden my-4 p-4 text-left border`}>
                <div className="flex w-full items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-3">
                        <div className="cursor-pointer" onClick={() => router.push(`/profile/${post.author._id}`)}>
                            <UserAvatar userId={post.author._id} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-700 hover:text-slate-500 text-left cursor-pointer" onClick={() => router.push(`/profile/${post.author._id}`)}>
                                {post.author.name}
                            </p>
                            <p className="text-xs text-neutral-500 hover:text-neutral-400 cursor-pointer" onClick={() => router.push(`/post/${post._id}`)}>
                                Publicado {formatRelativeDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    { userId !== post.author._id && 
                    (   <div>
                            <ReportForm postId={post._id}/>
                        </div>
                    )}

                </div>
                
                <div className="mt-4 mb-6">
                    <div className="mb-3 text-xl font-bold">{post.title}</div>
                    <div className="text-sm text-neutral-600">{post.description}</div>
                </div>
                {options.show_images &&(
                    <ImageModal images={post.images}/>
                )}

                { options.show_hashtags && (
                    <div className="flex flex-wrap border-b pb-3 pt-4 space-x-2">
                        {post.hashtags.map((hashtag, index) => (
                            <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.nameHashtag}</button>
                        ))}
                    </div>
                )}

                <div className="p-0 sm:px-4 py-4 flex justify-between">
                    <div className="flex sm:space-x-4 space-x-1">

                        {options.show_interactions && (
                                <div className="bg-zinc-200 sm:rounded-full flex">
                                    {renderInteractionButton(post, "helpful")}
                                    {renderInteractionButton(post, "nothelpful")}
                                </div>
                        )}

                        { options.show_icon_comments &&
                            <Button disabled={!post.status} onClick={() => scrollToComments(post._id)}
                            className="bg-zinc-200 hover:bg-zinc-300 text-black sm:rounded-full text-xs normal-case px-4 font-bold">
                                <CommentIcon />
                                <span className="hidden sm:block ml-1">Comentar</span>
                            </Button>
                        }

                        {options.show_icon_share && (
                            <Button onClick={ () => handleSharePost(post._id, userId)}
                                className={`bg-zinc-200 hover:bg-zinc-300 text-black sm:rounded-full text-xs normal-case px-4 font-bold ${isPostShared(post._id) ? 'bg-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 text-zinc-200' : 'bg-zinc-200 hover:bg-zinc-700 text-zinc-900 hover:text-zinc-200'}`}>
                                <ReplyIcon/>
                                <span className="hidden sm:block ml-1">Compartir</span>
                            </Button>
                        )}
                    </div>

                    {options.show_icon_save_post &&(
                        <>
                            <Button onClick={() => handleSavePost(post._id, userId)}
                            className={`ease-in duration-300 sm:rounded-full ${isPostSaved(post._id) ? 'bg-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 text-zinc-200' : 'bg-zinc-200 hover:bg-zinc-700 text-zinc-900 hover:text-zinc-200'}`}>
                                <BookmarkIcon />
                            </Button>
                        </>
                    )}

                </div>

                {options.create_comments && (
                    <div className="flex-wrap border-b pb-3 " ref={(el) => commentFormRefs.current[post._id] = el}>
                        <CommentForm postId={post._id} postStatus={post.status} autoFocus={focusedCommentId === post._id}/>
                    </div>
                )}

                { options.show_comments && (
                    <>
                        <CommentViewer postId={post._id} userId={userId}  />
                    </>
                )}
            </div>
            ))}
        </div>
    )}

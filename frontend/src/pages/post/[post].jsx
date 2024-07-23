/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI -------------------> */
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';



/* <----------------------- ICONOS UI --------------------------> */
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';


/* <--------------------- COMPONENTES NAV ----------------------> */
import NavBar from "@/components/nav/NavBar";

/* <------------------- COMPONENTES COMMON ---------------------> */
import UserAvatar from "@/components/common/UserAvatar";
import ConfirmDialog from "@/components/common/ConfirmDialog";

/* <------------------- COMPONENTES VIEWER ---------------------> */
import CommentViewer from "../../components/viewer/CommentViewer.jsx";

/* <------------------- COMPONENTES FORM ---------------------> */
import CommentForm from "../../components/form/CommentsForm.jsx"
import ReportForm from "../../components/form/ReportForm.jsx";

/* <------------------- COMPONENTES MODAL ----------------------> */
import ImageModal from "../../components/modal/ImageModal.jsx";

/* <------------------------ CONTEXTO --------------------------> */
import { useAuth } from "@/context/AuthContext";

/* <----------------------- SERVICIOS  -------------------------> */
import { getPost, markInteraction, updatePost, deletePost } from "@/services/post.service";

import IOSSwitch from "@/styles/components/IOSSwitchSyle.js";


export default function Post() {
    const router = useRouter();
    // Desectructuracion datos de usuario que esta navegando (user.id).
    const { user } = useAuth();
    // Desestructuracion de identificador de post y asignacion en variable `id`.
    const { post: id} = router.query;

    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Identificador de publicacion que se esta editando
    const [editingPostId, setEditingPostId] = useState(null);
    // Estado de campos editados de publicacion
    const [editedPost, setEditedPost] = useState({ title: "", description: "", status: false });
    // Estado de carga de edicion
    const [isEditingLoading, setIsEditingLoading] = useState(false);


    const [openDialog, setOpenDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

  /*<------------------------- SOLICITUDES HTTP------------------------->*/
      // Funcion encargada de obtener datos de publicacion por id (de publicacion).
      const fetchPost = async() => {
          try {
              const response = await getPost(id);
              setPost(response.data.data);
              setIsLoading(false);         
          } catch (error) {
              console.log("FRONTEND: Error en Post -> fetchPost() -> id:", id, error);
          }
      }
  /*<------------------------------- FORMATEO DE FECHAS DE PUBLICACIÓN -------------------------------> */
      const formatRelativeDate = (dateString) => {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
      };
  /*<--------------------------------- ELIMINACION DE PUBLICACIÓN --------------------------------->*/
      const handleOpenDialog = (postId) => {
        setPostToDelete(postId);
        setOpenDialog(true);
      };

      const handleCloseDialog = () => {
          setOpenDialog(false);
          setPostToDelete(null);
      };

      const handleDeletePost = async () => {
          try {
            await deletePost(postToDelete);
            handleCloseDialog();
            setShowAlert(true);
            // Esperamos 3 segundos antes de redirigir
            setTimeout(() => {
                router.push('/');
            }, 3000);
          } catch (error) {
              console.error("Error deleting post:", error);
          }
      };
  

  /* <--------------------------------- INTERACCIONES DE PUBLICACIÓN --------------------------------->*/
      const handleReaction = async (postId, reactionType) => {
        try {
          await markInteraction(postId, { id: user.id, type: reactionType });
          setPost(prevPost => {
            const isReacted = prevPost.interactions.some(i => i.user === user.id && i.type === reactionType);
            const updatedInteractions = isReacted
              ? prevPost.interactions.filter(i => !(i.user === user.id && i.type === reactionType))
              : [...prevPost.interactions, { user: user.id, type: reactionType }];
              
            return { ...prevPost, interactions: updatedInteractions };
          });
          fetchPost();
        } catch (error) {
          console.error("Error marking interaction:", error);
        }
      }
      /* Funcion que genera un boton de interaccion de publicación a según los parametros que reciba, tambien
      refleja el estado marcado en la publicación */
      const renderInteractionButton = (post, reactionType) => {
        const isReacted = post.interactions?.some((interaction) => interaction.user === user.id && interaction.type === reactionType);
        const count = post.interactions?.filter(interaction => interaction.type === reactionType).length;
        return (
          <Button className={`text-black text-xs gap-2 px-3 hover:bg-zinc-300 ${reactionType === 'helpful' ? 'rounded-l-full' : 'rounded-r-full'} ${isReacted ? "bg-zinc-300" : ""}`}
          onClick={() => handleReaction(post._id, reactionType)}
          >
                  {reactionType === 'helpful' ? <ThumbUpIcon className="text-black" /> : <ThumbDownIcon className="text-black" />} ({count})
              </Button>
          );
        };
  /*<--------------------------------  MODO EDICION DE PUBLICACIÓN -------------------------------->*/
      // Funcion encargada de renderizar los input/text area modificables con la informacion de titulo/descripcion de publicacion(post)
      const renderEditForm = (post) => {
        return (
          <div className="flex flex-col mt-4 mb-6">
              { isEditingLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : (
                    <>
                      <input type="text" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} className="p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-zinc-400" />
                      <textarea className="w-full p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-zinc-400" 
                          value={editedPost.description} rows="4" onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                      />
                      {/* <div className="flex justify-end space-x-2">
                        <Button className="bg-zinc-300 text-zinc-900 hover:bg-red-400 hover:text-white normal-case" onClick={() => setEditingPostId(null)}>Cancelar</Button>
                        <Button className="bg-zinc-400 text-zinc-900 hover:bg-zinc-800 hover:text-white normal-case" onClick={() => handleSaveEdit(post._id)}>Guardar</Button>
                      </div> */}
                    </>
                  )
              }
          </div>
      )}
                        
      // Funcion encargada de habilitar edicion de publicación
      const handleEditPost = (post) => {
        if (editingPostId === post._id) {
            // Toggle off edit mode
            setEditingPostId(null);
        } else {
            // Enable edit mode
            setEditingPostId(post._id);
            setEditedPost({ title: post.title, description: post.description, status: post.status });
        }
    }
      // Funcion encargada de enviar solicitud http PUT para modificar campos de publicacion
      const handleSaveEdit = async (postId) => {
        setIsEditingLoading(true);
        setTimeout(async () => {
          try {
            // Servicio encargado de enviar solicitud HTTP PUT.
            await updatePost(postId, editedPost);
            setPost(prevPost => ({ ...prevPost, ...editedPost }));
            setEditingPostId(null);
          } catch (error) {
            console.error("Error updating post:", error);
          } finally {
            setIsEditingLoading(false);
          }
        },1500);
      };
      // Funcion encargada de manejar el cambio de estado desde el boton switch en el modo edicion.
      const handleStatusChange = (event) => {
        setEditedPost({ ...editedPost, status: event.target.checked });
      };

  /*<------------------- EFECTOS DE ACTUALIZACIÓN------------------->*/
      useEffect(() => {
        if (id) {
          fetchPost();
          }
      }, [id]);
      // Titulo de pagina, cargando hasta que carguen los datos de publicacion
      useEffect(() => {
        if (post.title) {
          document.title = `${post.title}`;
        } else {
          document.title = "Publicación";
        }
      }, [post]);
          
    const showPost = ( ) =>{
      return (
        <>
          <div className="flex w-full items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                  <div onClick={()=> router.push(`/profile/${user.id}`)}>
                      <UserAvatar userId={post.author._id}/>
                  </div>
                  <div>
                      <p className="text-lg font-bold text-slate-700">{post.author.name}</p>
                      <p className="text-xs text-neutral-500">
                          {formatRelativeDate(post.createdAt)}
                      </p>
                  </div>
              </div>

              <div className="flex items-center space-x-4">
                  { post.author._id === user.id 
                    ? ( <>

                          <IconButton aria-label="delete" size="small" onClick={() => handleOpenDialog(post._id)} >
                                <DeleteIcon/>
                          </IconButton>

                          { editingPostId === post._id && ( 
                            <IOSSwitch checked={editedPost.status} onChange={handleStatusChange} />
                          )}

                          {editingPostId === post._id ? (
                              <>
                                  <IconButton aria-label="confirm" size="small" onClick={() => handleSaveEdit(post._id)}>
                                      <CheckIcon/>
                                  </IconButton>
                                  <IconButton aria-label="cancel" size="small" onClick={() => setEditingPostId(null)}>
                                      <ClearIcon/>
                                  </IconButton>
                              </>
                          ) : (
                              <IconButton aria-label="edit" size="small" onClick={() => handleEditPost(post)} className="bg-zinc-200 rounded-lg">
                                  <EditIcon/>
                              </IconButton>
                          )}
                        </> 
                      )
                    : ( <IconButton>
                          <ReportForm/>
                        </IconButton> )
                  }
              </div>
          </div>

          { editingPostId === post._id ?(
              renderEditForm(post)
            ) : (
                <div className="mt-4 mb-6">
                    <p className="mb-3 text-xl font-bold">{post.title}</p>
                    <p className="text-sm text-neutral-600">{post.description}</p>
                </div>
            )
          }

          <ImageModal images={post.images} />

          <div className="flex flex-wrap border-b pb-3 pt-4 gap-2">
              {post.hashtags.map((hashtag, index) => (
                  <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.nameHashtag}</button>
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
              <>
                  <Button className="bg-zinc-200 hover:bg-zinc-300 text-black rounded-full">
                    <BookmarkIcon/>
                  </Button>
              </>
          </div>

          <div className="flex-wrap pb-3 ">
              <CommentForm postId={post._id} postStatus={post.status} />
          </div>

          <div>
              <CommentViewer  postId={post._id} userId={user.id}/>
          </div>

          {showAlert && (
              <Alert 
                  severity="success" 
                  onClose={() => setShowAlert(false)}
                  sx={{ position: 'fixed', top: '90%', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
              >
                  Publicación eliminada con éxito
              </Alert>
          )}

          <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleDeletePost}
            title="Confirmar Eliminación" message="¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer."
          />

        </>
      )
    }

  return (
    <>
        <NavBar userId={user.id} />
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-4 p-4">
            { isLoading ? <div>Cargando</div> : showPost() }
        </div>
    </>
  )
}

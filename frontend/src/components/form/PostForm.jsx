/* <----------------------- MODULOS --------------------------> */
import Creatable, { useCreatable } from 'react-select/creatable';

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect, useRef } from "react";

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/* <----------------------- ICONOS --------------------------> */
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags } from "@/services/hashtag.service";
import { createPost } from "@/services/post.service";


const PostForm = ( { updatePosts, userId } ) => {

  const creatableRef = useRef(null);

  /**<-------------------------- SETEO ESTADO DE CARGA ------------------------------>*/
  const [isLoading, setIsLoading] = useState(false);

  /**<------------- SETEO DE CAMPOS DE FORMULARIO PARA CREAR PUBLICACION----------------->*/
  const [postValues, setPostValues] = useState({
    author: userId,
    title: "",
    description: "",
    images: [],
    hashtags: []
  });

  /**<------------- SETEO DE ESTADO DE HABILITACION DEL BOTON DE ENVIO ----------------->*/
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(postValues.title.trim() === "" || postValues.description.trim() === "");
  }, [postValues.title, postValues.description]);

  /** <-----------------------  SOLICITUD Y SETEO DE HASHTAGS ----------------------->*/
  const [hashtagValues, setHashtagValues] = useState([]);

  const getDataHashtags = async () =>{
    try {
      const response = await getHashtags();
      const optionsHashtags = response.data.data.data.map(hashtag => ({
        value: hashtag.nameHashtag,
        label: hashtag.nameHashtag
      }))
      setHashtagValues(optionsHashtags);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getDataHashtags();
  }, []);

  /** <------------------  MANEJO DE CAMBIOS DE CAMPOS DE FORMULARIO ----------------->*/
  // Logica en caso de cambios en campos `title` y `description`
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostValues(prevState => ({
      ...prevState,
      [name]: value      
    }));
  };
  // Logica en caso de cambios en campo de `hashtags`
  const handleHashtagChange = (selectedOptions) => {
    const hashtags = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setPostValues(prevState => ({
      ...prevState,
      hashtags
    }));
  };
  // Logica en caso de cambios(agregar) en el campo de `images`
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostValues(prevState => ({ ...prevState, images: [...prevState.images, ...files] }));
  };

  const handleRemoveImage = (e) => {
    setPostValues(prevState => ({
      ...prevState,
      images: prevState.images.filter( (_, i) => i !== e)
    }));
  }

  // Construccion de objeto `FormData` que almacena los datos/campos del formulario para enviar solicitud
  const prepareFormData = () => {
    const formData = new FormData();
    formData.append("author", postValues.author);
    formData.append("title", postValues.title);
    formData.append("description", postValues.description);
    postValues.hashtags.forEach(hashtag => {
      formData.append("hashtags[]", hashtag);
    });
    postValues.images.forEach(image => {
      formData.append("images", image);
    });
    return formData;
  };

  // Reestablecimiento de valores del formulario a sus valores iniciales.
  const resetForm = () => {
    setPostValues({
      author: userId,
      title: "",
      description: "",
      images: [],
      hashtags: []
    });
    creatableRef.current.clearValue();
  };

  /** <------------  MANEJO DEL ENVIO DE FORMULARIO PARA CREAR PUBLICACION ----------->*/
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = prepareFormData();
      await createPost(formData);
      await getDataHashtags();
      updatePosts();
      resetForm();
    } catch (error) {
      console.log("[Error onSubmit] -> ",error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <div className='flex flex-row p-4 max-w-3xl mx-auto space-x-2 bg-zinc-100 mt-4 rounded shadow-md'>
        <form className="flex flex-col w-full" encType="multipart/form-data">

          <input placeholder='Titulo' name="title" value={postValues.title} onChange={handleChange}
            className='p-2 mb-2 border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-blue-500 flex w-full'>
          </input>

          <textarea id="postContent" rows="4" placeholder="Cuentanos más sobre lo que quieres publicar :-)" onChange={handleChange} name="description" value={postValues.description}
            className="p-2 mb-2 border-2 rounded-md px-4 py-2 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500" >
          </textarea>

          <div className="flex flex-wrap gap-2 mb-2">
            {postValues.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt={`upload-${index}`} className="w-28 h-28 object-cover rounded-md" />
                <button type="button" className="absolute top-2 right-0 bg-white hover:bg-cyan-200 rounded-full py-0.5 px-1" onClick={() => handleRemoveImage(index)}>
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>

          <div className='flex flex-row items-center justify-end space-x-2'>
              <Creatable ref={creatableRef} isClearable isMulti placeholder="Selecciona hashtags" options={hashtagValues} onChange={handleHashtagChange} className="rounded flex-grow sm:text-sm sm:leading-5" instanceId="hashtag-select" />
    
              <label htmlFor="image-input" className="bg-white px-4 flex justify-center items-center h-full cursor-pointer rounded hover:bg-sky-500 duration-150 ease-in-out" title='Agregar imagen'>
                <AddPhotoAlternateIcon />
                <input id="image-input" type="file" name="images" multiple onChange={handleImageChange} className="hidden"/>
              </label>

              <Button variant="contained" endIcon={<SendIcon />} className="rounded px-8 py-2" onClick={onSubmit} disabled={isLoading || isSubmitDisabled}>
                    {isLoading ? <CircularProgress size={24} /> : "Publicar"} {/* Mostrar animación de carga */}
              </Button>
          </div>
  
        </form>
      </div>
  )
}

export default PostForm;
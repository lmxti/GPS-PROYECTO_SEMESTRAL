/* <----------------------- MODULOS --------------------------> */
import Creatable, { useCreatable } from 'react-select/creatable';

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect, useRef } from "react";

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/* <----------------------- ICONOS --------------------------> */
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags } from "@/services/hashtag.service";
import { createPost } from "@/services/post.service";


const PostForm = ( { updatePosts, userId } ) => {

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
  // Referencia a los valores de hashtags
  const creatableRef = useRef(null);
  // Estado para controlar numero de caracteres
  const [charCount, setCharCount] = useState(0);
  // Limite de caracteres
  const maxCharLimit = 300;
  // Seteo de visibilidad de componente creatable/select
  const [isCreatableVisible, setIsCreatableVisible] = useState(false);

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

    if (name === 'description') {
      // Actualizacion de numero de caracteres de description.
      setCharCount(value.length);
    }
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
    setCharCount(0)
  };
  // Toggle de visibilidad de componente creatable para seleccionar hashtags
  const handleHashtagIconClick = () => {
    setIsCreatableVisible(!isCreatableVisible);
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

  /** <---------------------  ESTILO PERSONALIZADO DE CREATABLE -------------------->*/
    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'rgb(245 245 245)', // bg-zinc-100 color
        borderColor: state.isFocused ? 'rgb(161 161 170)' : provided.borderColor,
        '&:hover': {
          borderColor: state.isFocused ? 'rgb(161 161 170)' : provided.borderColor
        }
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: 'white'
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'rgb(229 231 235)' : 'white'
      })
    };
  
  return (
      <div className='flex flex-row p-4 max-w-3xl mx-auto space-x-2  bg-white rounded shadow border border-gray-300'>
        <form className="flex flex-col w-full" encType="multipart/form-data">
          <input placeholder='Titulo' name="title" value={postValues.title} onChange={handleChange}
            className='p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-zinc-400'>
          </input>

        <div className='relative'>
          <textarea id="postContent" maxLength={maxCharLimit} rows="4" placeholder="Cuentanos más sobre lo que quieres publicar :-)" onChange={handleChange} name="description" value={postValues.description}
            className="w-full p-2 mb-2 border-2 rounded-md bg-zinc-100 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-zinc-400" >
          </textarea>
          <p className='absolute right-2 bottom-4 text-xs p-2 text-zinc-400'>
            {charCount}/300
          </p>
        </div>

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

          {/* <--------------------------------------- SECTION IMAGES/HASHTAGS BUTTONS --------------------------------------->*/}
          <div className='flex justify-between space-x-2 mb-4 items-center'>
              {/* <---------------- Botones de archivo/imagen y hashtags ---------------->*/}
            <div className="flex text-gray-500 ">
                {/* Input de archivos/imagenes */}
                <label htmlFor="image-input" className="cursor-pointer" title='Agregar imagenes'>
                  <svg className="mr-2 hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  <input id="image-input" type="file" name="images" multiple onChange={handleImageChange} className="hidden"/>
                </label>

                {/* Icono de hashtags */}
                <label title='Agregar hashtags'>
                  <svg  onClick={handleHashtagIconClick} className="mr-2 hover:text-gray-700 border rounded-full p-1 h-7 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 500 500" stroke="currentColor">
                    <path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z" />
                  </svg>
                </label>
            </div>
              {/* <------------------ INPUT DE SELECCION DE HASHTAGS ------------------>*/}
            <div className={`w-full transition-opacity ${isCreatableVisible ? 'opacity-100' : 'opacity-0'} duration-300 ease-in-out`}>
              <Creatable ref={creatableRef} styles={customStyles} isClearable isMulti placeholder="Selecciona hashtags"
                  options={hashtagValues} onChange={handleHashtagChange} instanceId={1}
                  className="rounded flex-grow sm:text-sm  "/>
            </div>

          </div>

          <div className='flex justify-end space-x-2'>
             {isSubmitDisabled ? ""
             :
              <Button onClick={resetForm} className='border-4 p-2 border-gray-500 text-gray-400 hover:text-gray-500 normal-case px-5 bg-gray-100 hover:bg-gray-200'>Cancelar</Button>
             }
              <Button variant="contained" endIcon={<SendIcon />} className="rounded px-8 py-2" onClick={onSubmit} disabled={isLoading || isSubmitDisabled}>
                    {isLoading ? <CircularProgress size={24} /> : "Publicar"} {/* Mostrar animación de carga */}
              </Button>
          </div>
  
        </form>
      </div>
  )
}

export default PostForm;
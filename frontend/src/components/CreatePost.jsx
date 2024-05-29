/* <----------------------- MODULOS --------------------------> */
import Creatable, { useCreatable } from 'react-select/creatable';

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Avatar from '@mui/material/Avatar';

/* <----------------------- ICONOS --------------------------> */
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags } from "@/services/hashtag.service";
import { createPost } from "@/services/post.service";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from '@/context/AuthContext.jsx';

const CreatePost = () => {
  const { user } = useAuth();

  const [postValues, setPostValues] = useState({
    author: user.id,
    title: "",
    description: "",
    images: [],
    hashtags: []
  });

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
  }

  useEffect(() => {
    getDataHashtags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostValues(prevState => ({
      ...prevState,
      [name]: value      
    }));
  }

  const handleHashtagChange = (selectedOptions) => {
    const hashtags = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setPostValues(prevState => ({
      ...prevState,
      hashtags
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostValues(prevState => ({ ...prevState, images: [...prevState.images, ...files] }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("author", postValues.author);
      formData.append("title", postValues.title);
      formData.append("description", postValues.description);
      postValues.hashtags.forEach((hashtag) => {
        formData.append("hashtags[]", hashtag);
      });
      postValues.images.forEach((image) => {
        formData.append("images", image);
      });

      await createPost(formData);
      console.log(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-row p-4 w-3/4 mx-auto space-x-2'>
      <div>
        <Avatar/>
      </div>
        
      <form className="flex flex-col w-full" encType="multipart/form-data">
        <input placeholder='Titulo' name="title" value={postValues.title} onChange={handleChange}
          className='bg-gray-100 p-2 mb-4 border-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-blue-500 flex w-full'>
        </input>

        <textarea id="postContent" rows="4" placeholder="Cuentanos más sobre lo que quieres publicar :-)" onChange={handleChange} name="description" value={postValues.description}
          className="bg-gray-100 p-2 mb-2  rounded-md px-4 py-2 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500" >
        </textarea>

        <Creatable isMulti placeholder="Hashtags" onChange={handleHashtagChange}
          className="bg-gray-100 mb-2 rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:border-blue-500"
          options={hashtagValues}
        >
        </Creatable>

        <div className="mb-2">
          <input type="file" name='images' multiple onChange={handleImageChange} />
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {postValues.images.map((image, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(image)} alt={`upload-${index}`} className="w-full h-full object-cover rounded-md" />
            </div>
          ))}
        </div>

        <Button variant="contained" endIcon={<SendIcon />} className="rounded" onClick={onSubmit}>
          Publicar
        </Button>
      </form>
    </div>
  )
}

export default CreatePost;
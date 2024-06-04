/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

/* <----------------------- SERVICIOS  -----------------------> */
import { getPosts } from "@/services/post.service";

const PostViewer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga

  const getDataPosts = async () => {
    try {
      const response = await getPosts();
      const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); 
    }
  };

  const formatRelativeDate = (dateString) => {
    // Conversion de cadena de fecha en un objeto de tipo 'Date'
    const date = parseISO(dateString);
    // Retorno de diferencia relativa a fecha actual (suffix, locale marca el idioma)
    return formatDistanceToNow(date, { addSuffix: true, locale: es }); // Retorna la diferencia relativa con la fecha actual
  };

  const getGridColumns = (imageCount) => {
    if (imageCount === 1) {
      return 1;
    } else if (imageCount === 2 || imageCount === 4) {
      return 2;
    } else {
      return 3; 
    }
  };

  const showSkeletons = () => (
    <div >
      {Array.from(new Array(3)).map((_, index) => (
        <div key={index} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4 p-4">

          <div className="flex w-full items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circular" width={45} height={40} />
              <Skeleton variant="text" width={250} />
            </div>

          <div className="flex items-center space-x-8">
              <Skeleton variant="text" width={50} />
          </div>
        </div>


          <div>
            <Skeleton variant="rectangular" width={'100%'}  height={200} />
          </div>
          

          <div className="px-4 py-2">
            <div className="flex space-x-4 md:space-x-8">
              <Skeleton variant="rounded" width={200} height={40} />
              <Skeleton variant="rounded" width={200} height={40} />
              <Skeleton variant="rounded" width={150} height={40} />
              <Skeleton variant="rounded" width={150} height={40} />

            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const showPosts = () => {
    return posts.map((post) => (
      <div key={post._id} className="max-w-4xl mx-auto bg-zinc-100 shadow-lg rounded-lg overflow-hidden mb-4 p-4">

        <div className="flex w-full items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 rounded-full bg-slate-400" />
            <p className="text-lg font-bold text-slate-700">{post.author.name}</p>
            <p className="text-xs text-neutral-500">{formatRelativeDate(post.createdAt)}</p>
          </div>

          <div className="flex items-center space-x-8">
            {/* Aca van los botones de editar, o mas opciones */}
              Editar
              Eliminar
          </div>
        </div>

        <div className="mt-4 mb-6">
          <div className="mb-3 text-xl font-bold">{post.title}</div>
          <div className="text-sm text-neutral-600">{post.description}</div>
        </div>

        <div className={`grid grid-cols-${getGridColumns(post.images.length)} gap-4 mt-2`}>
          {post.images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} className="w-full h-full rounded-lg object-cover shadow-lg" />
          ))}
        </div>

        <div className="flex flex-wrap border-b pb-3 pt-4">
          {post.hashtags.map((hashtag, index) => (
            <button key={index} className="rounded-2xl border bg-neutral-100 px-3 py-1 text-xs font-semibold">#{hashtag.name}</button>
          ))}
        </div>

        <div className="px-4 py-2">
          <div className="flex space-x-4 md:space-x-8">
            <div className="flex cursor-pointer items-center transition hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>125</span>
            </div>
            <div className="flex cursor-pointer items-center transition hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>4</span>
            </div>
          </div>
        </div>

      </div>
    ));
  };

  useEffect(() => {
    getDataPosts();
  }, []);

  return (
    <div>
      {loading ? showSkeletons() : (Array.isArray(posts) && posts.length > 0 ? showPosts() : <p>No posts available</p>)}
    </div>
  );
};

export default PostViewer;

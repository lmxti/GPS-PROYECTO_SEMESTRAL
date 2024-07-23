/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags, followHashtag, unfollowHashtag } from "@/services/hashtag.service";
import { getUserFollowedHashtags } from "@/services/user.service";

import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import AddIcon from '@mui/icons-material/Add';

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";

const HashtagsViewer = () => {
  // Desectructuracion datos de usuario que esta navegando (user.id).
  const { user } = useAuth();
  // Seteo de hashtags seguidos por el usuario.
  const [followHashtags, setFollowHashtags] = useState([]);
  // Seteo de hashtags existentes
  const [hashtags, setHashtags] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const getHashtagsList = async () => {
    try {
        const response = await getHashtags();
        setHashtags(response.data.data.data);
    } catch (error) {
        console.error("Error fetching hashtags:", error);
    }
}

  //<----------------------------- HASHTAGS SEGUIDOS DE USUARIO ----------------------------->
  const getFollowHashtagsList = async (id) => {
    try {
      const response = await getUserFollowedHashtags(id);
      setFollowHashtags(response.data.data);
    } catch (error) {
      console.error("Error fetching hashtags:", error);
    }
  };
  // <------------------------------ MANEJO DE HASHTAGS SEGUIDOS----------------------------->
  // Funcion para seguir un hashtag.
  const handleFollow = async (hashtagID) => {
    try {
      await followHashtag(user.id, hashtagID);
      getFollowHashtagsList(user.id);
    } catch (error) {
      console.error("Error following hashtag:", error);
    }
  };
  // Funcion para dejar de seguir un hashtag.
  const handleUnfollow = async (hashtagID) => {
    try {
      await unfollowHashtag(user.id, hashtagID);
      getFollowHashtagsList(user.id);
    } catch (error) {
      console.error("Error unfollowing hashtag:", error);
    }
  };

  const showFollowHashtags = () => {
    // En caso que el usuario no siga ningun hashtag.
    if (!followHashtags || followHashtags.length === 0) {
      return null;
    }
    return followHashtags.map((hashtag, index) => (
      <li key={index} className="bg-zinc-200 hover:bg-zinc-300 w-fit px-2 py-1 rounded text-zinc-500 hover:text-zinc-600 tracking-wider flex items-center space-x-1 cursor-pointer
       select-none ease-in-out transition"
      >
        <span className="font-extrabold">#</span><span className="text-xs">{hashtag.nameHashtag}</span>
        { isEditing &&
            <CancelSharpIcon fontSize="small" className="text-zinc-500 hover:text-red-600" onClick={() => handleUnfollow(hashtag._id)}/>
        }
      </li>
    ));
  };

  const showHashtagsList = () => {
    if (!hashtags || hashtags.length === 0) return null; 
    return hashtags
      .filter(hashtag => !isHashtagFollowed(hashtag._id))
      .map((hashtag, index) => (
        <li key={index} className="bg-zinc-200 hover:bg-zinc-300 w-fit px-2 py-1 rounded text-zinc-500 hover:text-zinc-600 tracking-wider flex items-center space-x-1 cursor-pointer
       select-none ease-in-out transition">
          <span className="font-extrabold">#</span><span className="text-xs">{hashtag.nameHashtag}</span>
          <button onClick={() => handleFollow(hashtag._id)} >
            <AddIcon fontSize="inherit" className="text-zinc-500 hover:text-zinc-900"/>
          </button>
        </li>
      ));
  };

  const isHashtagFollowed = (hashtagId) => {
    return followHashtags.some(followedHashtag => followedHashtag._id === hashtagId);
  };

  useEffect(() => {
    getHashtagsList();
    getFollowHashtagsList(user.id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="md:block mx-4 border-2 rounded">
        <div className="bg-zinc-200 py-2 flex justify-between px-4">
            <p>Hashtags que sigues</p>
            <Button className="text-zinc-500 font-thin text-sm normal-case" onClick={() => setIsEditing(!isEditing)}> {isEditing ? 'Salir' : 'Editar'}</Button>
        </div>
        <div className="py-4 px-2">
            <ul className="flex flex-wrap gap-1">{showFollowHashtags()}</ul>
        </div>
      </div>

      <div className="md:block mx-4 border-2 rounded">
        <div className="bg-zinc-200 py-2 flex justify-between px-4">
            <p>Sugerencias</p>
        </div>
        <div className="py-4 px-2">
            <ul className="flex flex-wrap gap-1">{showHashtagsList()}</ul>
        </div>

      </div>
    </div>
  );
};

export default HashtagsViewer;

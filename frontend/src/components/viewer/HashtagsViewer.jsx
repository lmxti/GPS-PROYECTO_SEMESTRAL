/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";


import Typography from '@mui/material/Typography';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags, followHashtag, unfollowHashtag } from "@/services/hashtag.service";
import { getUserFollowedHashtags } from "@/services/user.service";
import { useAuth } from "@/context/AuthContext";

const HashtagsViewer = () => {
    const { user } = useAuth();

    const [hashtags, setHashtags] = useState([]);
    const getHashtagsList = async () => {
        try {
            const response = await getHashtags();
            setHashtags(response.data.data.data);
        } catch (error) {
            console.error("Error fetching hashtags:", error);
        }
    }

    const [followHashtags, setFollowHashtags] = useState([]);
    const getFollowHashtagsList = async (id) => {
        try {
            const response = await getUserFollowedHashtags(id);
            setFollowHashtags(response.data.data);
        } catch (error) {
            console.error("Error fetching hashtags:", error);
        }
    }

    const handleFollow = async (hashtagID) => {
        try {
            await followHashtag(user.id, hashtagID);
            getFollowHashtagsList(user.id);
        } catch (error) {
            console.error("Error following hashtag:", error);
        }
    }

    const handleUnfollow = async (hashtagID) => {
        try {
            await unfollowHashtag(user.id, hashtagID);
            getFollowHashtagsList(user.id);
        } catch (error) {
            console.error("Error unfollowing hashtag:", error);
        }
    }

    const showFollowHashtags = () => {
            
            if (!followHashtags || followHashtags.length === 0) {
                return null; // O muestra un mensaje alternativo si prefieres
            }
    
            return followHashtags.map((hashtag, index) => (
                <li key={index} className="inline-block py-1 px-4 bg-gray-200 rounded-lg mb-2 mr-2">
                    #{hashtag.nameHashtag}
                    <button className="bg-zinc-400 mx-2 px-2 rounded" onClick={() => handleUnfollow(hashtag._id)}>&times;</button>
                </li>
            ));
        }

    const showHashtags = () => {
        if (!hashtags || hashtags.length === 0) return null; 
        return hashtags.map((hashtag, index) => (
            <li key={index} className=" py-1 px-2 text-zinc-600 hover:text-black bg-zinc-300 hover:bg-zinc-300 rounded-lg font-sans text-xs">
                #{hashtag.nameHashtag}
                <button onClick={() => handleFollow(hashtag._id)} >
                    <AddBoxOutlinedIcon/>
                </button>
            </li>
        ));
    }
    useEffect(() => {
        getHashtagsList();
        getFollowHashtagsList(user.id);
    }, []);

    return (
        <main>
        <div className="p-6 mx-4 border-b text-center">
            <p className='font-thin text-2xl text-center mb-4'>Hashtags</p>
            <ul className="list-none p-0 flex flex-wrap gap-2 justify-center">
                {showHashtags()}
            </ul>
        </div>

        <div className="p-6 mx-4 border-b text-center">
            <p className='font-thin text-2xl text-center mb-4'>Hashtags seguidos</p>
            <ul className="list-none p-0 flex flex-wrap">
                {showFollowHashtags()}
            </ul>
        </div>
        </main>
    );
}

export default HashtagsViewer;

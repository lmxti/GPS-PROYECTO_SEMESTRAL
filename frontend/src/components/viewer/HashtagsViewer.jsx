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
                <li key={index} 
                    className="bg-zinc-300 hover:bg-zinc-500 w-fit px-2 py-1 rounded text-zinc-500 hover:text-zinc-50 tracking-wider flex
                    items-center space-x-1 cursor-pointer select-none ease-in-out transition">
                    <span className="font-extrabold">#</span>
                    <span className="text-xs">{hashtag.nameHashtag}</span>
                    {/* <button className="bg-zinc-400 mx-2 px-2 rounded" onClick={() => handleUnfollow(hashtag._id)}>&times;</button> */}
                </li>
            ));
        }

    const showHashtags = () => {
        if (!hashtags || hashtags.length === 0) return null; 
        return hashtags.map((hashtag, index) => (
            <li key={index} className="flex items-center text-center gap-2 py-1 px-2 text-zinc-800 hover:text-black bg-zinc-300 hover:bg-zinc-400 rounded-lg font-sans text-xs transition ease-linear">
                #{hashtag.nameHashtag}
                <button onClick={() => handleFollow(hashtag._id)} >
                    <AddBoxOutlinedIcon fontSize="inherit" className="text-zinc-900"/>
                </button>
            </li>
        ));
    }
    useEffect(() => {
        getHashtagsList();
        getFollowHashtagsList(user.id);
    }, []);

    return (
        <main className="hidden md:block">
            <div className="p-6 mx-4 border-b text-center">
                <p className='font-thin text-2xl text-center mb-4'>Hashtags</p>
                <ul className="list-none p-0 flex flex-wrap gap-2">
                    {showHashtags()}
                </ul>
            </div>

            <div className="p-6 mx-4 border-b">
                <p className='font-thin text-2xl text-center mb-4'>Hashtags</p>
                <p className="text-sm my-4">Estos son los hashtags que sigues</p>
                <ul className="flex flex-wrap gap-1">
                    {showFollowHashtags()}
                </ul>
            </div>
        </main>
    );
}

export default HashtagsViewer;

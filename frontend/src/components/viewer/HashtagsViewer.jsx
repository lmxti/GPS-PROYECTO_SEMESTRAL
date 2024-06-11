/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";


import Typography from '@mui/material/Typography';

/* <----------------------- SERVICIOS  -----------------------> */
import { getHashtags } from "@/services/hashtag.service";

const HashtagsViewer = () => {
    const [hashtags, setHashtags] = useState([]);
    const getHashtagsList = async () => {
        try {
            const response = await getHashtags();
            setHashtags(response.data.data.data);
        } catch (error) {
            console.error("Error fetching hashtags:", error);
        }
    }
    const showHashtags = () => {
        if (!hashtags || hashtags.length === 0) return null; 
        return hashtags.map((hashtag, index) => (
            <li key={index} className=" py-2 px-4 text-zinc-500 hover:text-black bg-white hover:bg-zinc-300 rounded-lg font-sans text-xs">
                #{hashtag.nameHashtag}
            </li>
        ));
    }
    useEffect(() => {
        getHashtagsList();
    }, []);

    return (
        <div className="p-4 border-b-2 ">
            <p className='font-thin text-2xl text-center mb-4'>Etiquetas</p>
            <ul className="flex flex-wrap justify-center gap-2 mt-4">
                {showHashtags()}
            </ul>
        </div>
    );
}

export default HashtagsViewer;

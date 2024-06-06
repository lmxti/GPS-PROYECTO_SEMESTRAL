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
        
        if (!hashtags || hashtags.length === 0) {
            return null; // O muestra un mensaje alternativo si prefieres
        }

        return hashtags.map((hashtag, index) => (
            <li key={index} className="inline-block py-1 px-4 bg-gray-200 rounded-lg mb-2 mr-2">
                #{hashtag.nameHashtag}
            </li>
        ));
    }

    useEffect(() => {
        getHashtagsList();
    }, []);

    return (
        <div className="p-6 mx-4 border-b text-center">
            <Typography variant="h5" gutterBottom>Hashtags</Typography>
            <ul className="list-none p-0 flex flex-wrap">
                {showHashtags()}
            </ul>
        </div>
    );
}

export default HashtagsViewer;

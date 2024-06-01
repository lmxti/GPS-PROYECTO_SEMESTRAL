import { useState, useEffect } from "react";
import { getHashtags } from "@/services/hashtag.service";

const HashtagsTopics = () => {
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
            <li
                key={index}
                className="inline-block py-2 px-4 bg-gray-200 rounded-lg mb-2 mr-2 shadow-md hover:bg-gray-300 whitespace-nowrap"
            >
                {hashtag.nameHashtag}
            </li>
        ));
    }

    useEffect(() => {
        getHashtagsList();
    }, []);

    return (
        <div className="">
            <h1 className="text-3xl font-bold text-center mb-6">Hashtags</h1>
            <ul className="list-none p-0 flex flex-wrap">
                {showHashtags()}
            </ul>
        </div>
    );
}

export default HashtagsTopics;

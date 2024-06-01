import { useState, useEffect } from "react";
import { getPosts } from "@/services/post.service";

const PostViewer = () => {
  const [posts, setPosts] = useState([]);

  const getDataPosts = async () => {
    try {
      const response = await getPosts();
      console.log(response.data.data);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  const showPosts = () => {
    return posts.map((post) => (
      <div key={post._id} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-4">
        <div className="px-4 py-2">
          <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
          <p className="text-gray-600 mt-2">{post.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {post.images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} className="w-full h-auto rounded-lg" />
          ))}
        </div>
        <div className="px-4 py-2">
          {/* Aquí puedes agregar elementos adicionales para el pie de página, como botones de interacción, contadores, etc. */}
        </div>
      </div>
    ));
  };
  
  
  useEffect(() => {
    getDataPosts();
  }, []);

  return (
    <div>
      PostViewer
      {Array.isArray(posts) && posts.length > 0 ? showPosts() : <p>No posts available</p>}
    </div>
  );
};

export default PostViewer;

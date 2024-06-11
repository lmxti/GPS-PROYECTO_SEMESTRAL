import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserInformation, getUserFollowedHashtags } from "@/services/user.service";
import NavBar from "@/components/nav/NavBar";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState([]);
  const [hashtags, setHashtags] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await getUserInformation(user.id);
      const data = response.data.data;
      setProfile(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> useEffect()", error);
    }
  };

  const fetchHashtags = async (ids) => {
    try {
      const response = await getUserFollowedHashtags(ids);
      const data = response.data.data;
      setHashtags(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> useEffect()", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHashtags(user.id);
  }, []);

  return (
    <main>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-xl font-bold mt-2">{profile.name}</h2>
            <p className="text-gray-500">{profile.surname}</p>
            <p>{profile.email}</p>
            <p>{profile.username}</p>

            <div className="flex flex-col items-center justify-center mt-4 w-full">
              <h2 className="text-xl font-bold mb-2">Hashtags seguidos</h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {hashtags.map((hashtag) => (
                  <span key={hashtag.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    #{hashtag.nameHashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;

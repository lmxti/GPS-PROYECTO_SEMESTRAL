import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserInformation, getUserFollowedHashtags } from "@/services/user.service";
import { useRouter } from 'next/router';
import NavBar from "@/components/nav/NavBar";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";

import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import CachedIcon from '@mui/icons-material/Cached';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PostProfileViewer from "@/components/viewer/PostProfileViewer";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Avatar from '@mui/material/Avatar';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const Profile = () => {
  const router = useRouter();
  // Desestructuracion de id de usuario actual.
  const { user } = useAuth();
  // Desectructuracion de id de perfil actual.
  const { profile: id } = router.query;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  
  const [profile, setProfile] = useState({});
  const [hashtags, setHashtags] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await getUserInformation(id);
      const data = response.data.data;
      setProfile(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> fetchProfile() -> id:",id, error);
    }
  };

  const fetchHashtags = async (ids) => {
    try {
      const response = await getUserFollowedHashtags(ids);
      const data = response.data.data;
      setHashtags(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> fetchHashtags()", error);
    }
  };

  const totalSeguidos = (profile.followed ? profile.followed.length : 0) + (hashtags.length);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchHashtags(user.id);
    }
  }, [id, user.id]);

  useEffect(() => {
    if (profile.name) {
      document.title = `Perfil - ${profile.name} ${profile.surname}  `;
    } else {
      document.title = "Cargando perfil...";
    }
  }, [profile]);

  return (
    <>
      <NavBar userId={user.id} />

      <section className="relative block h-[500px]">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('https://img.myloview.fr/images/black-and-white-pattern-on-white-background-abstract-design-700-176625414.jpg')",
          }}
        >
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
      </section>

      <section className="relative py-16 ">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64 ">
              <div className="flex flex-wrap justify-center">

                {/* Seccion de en medio - Imagen de usuario */}
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="rounded-ful absolute -top-24 overflow-hidden h-56 w-56 flex justify-center items-center rounded-full shadow-lg shadow-zinc-600">
                      <Avatar src={`http://localhost:3001/uploads/profiles/${profile.profilePicture}`} sx={{ width: '100%', height: '100%' }}></Avatar>
                      {/* <img alt="Profile" className="object-cover h-full w-full" 
                        // src={ profile.profilePicture ? `http://localhost:3001/uploads/profiles/${profile.profilePicture}`: 'https://avatarfiles.alphacoders.com/654/65419.jpg'}
                        src={ profile.profilePicture ? `http://localhost:3001/uploads/profiles/${profile.profilePicture}`: 'https://avatarfiles.alphacoders.com/654/65419.jpg'}

                      /> */}
                    </div>
                </div>

                {/* Seccion de la derecha - Botones */}
                <div className="w-full lg:w-4/12 px-4 lg:order-3">
                  <div className="py-6 px-3 mt-32 sm:mt-0 mx-auto flex justify-center">

                    {/* <button 
                      className="bg-zinc-500 active:bg-zinc-600 uppercase text-white font-bold  text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                      seguir
                    </button> */}
                  {profile.badges?.length > 0 
                      ? profile.badges.map((badge, index) => (
                          <div key={index} className="flex flex-col items-center  p-4 rounded ">
                            <img key={index} src={`data:image/png;base64,${badge.imageBadge}`} alt={badge.nameBadge} className="w-20 h-20 object-contain mb-2" title={`${badge.descriptionBadge}`} />
                            {/* <h4 className="text-lg font-semibold">{badge.nameBadge}</h4> */}
                            {/* <p className="text-gray-600">{badge.descriptionBadge}</p> */}
                          </div>
                    )) : <p>No hay insignias para mostrar</p>
                  }

                  </div>
                </div>

                {/* Seccion de la izquierda - informacion de usuario */}
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">

                    {/* Contador de publicaciones del usuario */}
                    <div className="lg:mr-4 p-3 text-center hover:bg-zinc-200 rounded transition ease-linear select-none">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{profile.posts ? profile.posts.length : 0}</span>
                      <span className="text-sm text-blueGray-400">Publicaciones</span>
                    </div>

                    {/* Contador de comentarios del usuario */}
                    {/* <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{profile.comments ? profile.comments.length : 0}</span>
                      <span className="text-sm text-blueGray-400">Comments</span>
                    </div> */}

                    <div className="lg:mr-4 p-3 text-center hover:bg-zinc-200 rounded transition ease-linear select-none">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{totalSeguidos}</span>
                      <span className="text-sm text-blueGray-400">Seguidos</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center hover:bg-zinc-200 rounded transition ease-linear select-none">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{profile.followers ? profile.followers.length : 0}</span>
                      <span className="text-sm text-blueGray-400">Seguidores</span>
                    </div>

                    



                  </div>
                </div>
              </div>

              <div className="text-center mt-10 pb-10">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                  {profile.name} {profile.surname}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold ">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  Nombre de usuario: {profile.username}
                </div>
                
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                  {profile.description ? profile.description : 'No hay descripcion'}
                </div>

                  <Box sx={{ width: '100%', marginTop: 4}}>
                      <Box sx={{ borderTop:1, borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs centered value={value} onChange={handleChange}>
                          <Tab icon={<ViewHeadlineIcon />}  {...a11yProps(0)} />
                          <Tab icon={<CachedIcon />}  {...a11yProps(1)} />
                          <Tab icon={<BookmarkIcon />} {...a11yProps(2)} />
                          <Tab icon={<WorkspacePremiumIcon />} {...a11yProps(3)} />

                        </Tabs>
                      </Box>
                      <CustomTabPanel value={value} index={0}>
                        {/* <PostProfileViewer key={update} id={id} userId={user.id} updatePosts={updatePosts}/> */}
                        <PostProfileViewer id={id} userId={user.id} />

                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        Item Two
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={2}>
                        Item Three
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={3}>
                        Item Four
                      </CustomTabPanel>
                  </Box>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

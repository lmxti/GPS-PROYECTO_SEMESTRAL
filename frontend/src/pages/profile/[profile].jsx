/* <----------------------- MODULOS ------------------------------> */
import PropTypes from 'prop-types'; // Libreria para validad tipos de propiedades(props)

/* <----------------------- FUNCIONES ---------------------------> */
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

/* <---------------- COMPONENTES MATERIAL UI --------------------> */
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

/* <----------------------- ICONOS UI ---------------------------> */
import CachedIcon from '@mui/icons-material/Cached';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

/* <--------------------- COMPONENTES NAV ----------------------> */
import NavBar from "@/components/nav/NavBar";

/* <------------------- COMPONENTES FORM ---------------------> */
import ProfileEditForm from '@/components/form/ProfileEditForm';

/* <------------------- COMPONENTES VIEWER ---------------------> */
import PostProfileViewer from "@/components/viewer/PostProfileViewer";

/* <------------------------ CONTEXTO --------------------------> */
import { useAuth } from "@/context/AuthContext";

/* <----------------------- SERVICIOS  -------------------------> */
import { getUserInformation, getUserFollowedHashtags, updateUser } from "@/services/user.service";

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
  // Desectructuracion datos de usuario (user.id).
  const { user } = useAuth();
  // Desesctructuracion de perfil de usuario y asignacion a variable `id`.
  const { profile: id } = router.query;
  // Seteo de datos del perfil de usuario.
  const [profile, setProfile] = useState({});
  // Seteo de datos de hashtags.
  const [hashtags, setHashtags] = useState([]);
  // Seteo de secciones del perfil seleccionada, `0` por default.
  const [section, setSection] = useState(0);

  //<----------------------------- MANEJO DE CAMBIOS DE SECCION ----------------------------->
  const handleSectionChange = (event, newValue) => {
    setSection(newValue);
  };

  //<----------------------------------- DATOS DE USUARIO ----------------------------------->
  const fetchProfile = async () => {
    try {
      const response = await getUserInformation(id);
      const data = response.data.data;
      setProfile(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> fetchProfile() -> id:", id, error);
    }
  };
  // Estadistica de total de seguidos de usuario, incluye la suma de tanto como usuarios y hashtags
  const totalSeguidos = (profile.followed ? profile.followed.length : 0) + (hashtags.length);

  //<---------------------------------- HASHTAGS DE USUARIO --------------------------------->
  const fetchHashtags = async (ids) => {
    try {
      const response = await getUserFollowedHashtags(ids);
      const data = response.data.data;
      setHashtags(data);
    } catch (error) {
      console.log("FRONTEND: Error en Profile -> fetchHashtags()", error);
    }
  };

  //<---------------------------------- MANEJO DE CARGA DE DATOS  --------------------------------->
  // Encargado de ejecutar solicitudes para cargar los datos cada 
  // vez que cambie la id tanto como del usuario y del perfil.
  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchHashtags(user.id);
    }
  }, [id, user.id]);

  //<---------------------------------- MANEJO DE DOCUMENTO  --------------------------------->
  // Titulo de pagina, cargando hasta que carguen los datos del perfil de usuario.
  useEffect(() => {
    if (profile.name) {
      document.title = `Perfil - ${profile.name} ${profile.surname}`;
    } else {
      document.title = "Cargando perfil...";
    }
  }, [profile]);

  const handleUpdateProfile = (updatedProfile) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      ...updatedProfile,
    }));
  };

  return (
    <>
      <NavBar userId={user.id} />

      <section className="relative block h-[500px]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://img.myloview.fr/images/black-and-white-pattern-on-white-background-abstract-design-700-176625414.jpg')"}}>
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
      </section>

      <section className="relative py-16 ">
        <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64 ">
                  {/*<-------------------------------------------------------- CABECERA DE PERFIL -------------------------------------------------------->*/}
                  <div className="flex flex-wrap justify-center">
                        {/*<---------------- SECCION-CABECERA FOTO DE PERFIL------------------>*/}
                        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                          <div className="rounded-ful absolute -top-24 overflow-hidden h-56 w-56 flex justify-center items-center rounded-full shadow-lg shadow-zinc-600">
                            <Avatar src={`http://localhost:3001/uploads/profiles/${profile.profilePicture}`} sx={{ width: '100%', height: '100%' }}></Avatar>
                          </div>
                        </div>
                        {/*<------------------ SECCION-CABECERA INSIGNIAS -------------------->*/}
                        <div className="w-full lg:w-4/12 px-4 lg:order-3">
                          <div className="py-6 px-3 mt-32 sm:mt-0 mx-auto flex justify-center">
                            {profile.badges?.length > 0 
                              ? profile.badges.map((badge, index) => (
                                  <div key={index} className="flex flex-col items-center p-4 rounded">
                                    <img src={`data:image/png;base64,${badge.imageBadge}`} alt={badge.nameBadge} className="w-20 h-20 object-contain mb-2" title={`${badge.descriptionBadge}`} />
                                  </div>
                                )) : <p>No hay insignias para mostrar</p>
                            }
                          </div>
                        </div>
                        {/*<------------------ SECCION-CABECERA ESTADISTICAS ------------------>*/}
                        <div className="w-full lg:w-4/12 px-4 lg:order-1">
                            <div className="flex justify-center py-4 lg:pt-4 pt-8">
                              <div className="lg:mr-4 p-3 text-center hover:bg-zinc-200 rounded transition ease-linear select-none">
                                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{profile.posts ? profile.posts.length : 0}</span>
                                <span className="text-sm text-blueGray-400">Publicaciones</span>
                              </div>

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
                  {/*<--------------------------------------------------------- CUERPO PERFIL --------------------------------------------------------->*/}
                  <div className="text-center mt-10 pb-10">
                         {/* <---------------- Nombre completo -----------------> */}
                        <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                          {profile.name} {profile.surname}
                        </h3>
                        {/* <------------- Nombre de usuario ----------------->*/}
                         <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                          Nombre de usuario: {profile.username}
                        </div> 
                        {/* <----------- Descripcion de usuario --------------> */}
                        <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                          Descripcion: {profile.description ? profile.description : ':)' }
                        </div>

                        <ProfileEditForm profile={profile} onUpdateProfile={handleUpdateProfile} />  

                        {/* <-------- CABECERA DE SECCIONES --------> */}
                        <Box sx={{ width: '100%', marginTop: 4 }}>
                              <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
                              {/*<---- Pestañas de secciones del perfil ---->*/}
                                <Tabs centered value={section} onChange={handleSectionChange}>
                                  <Tab icon={<ViewHeadlineIcon />}  {...a11yProps(0)} />
                                  <Tab icon={<CachedIcon />}  {...a11yProps(1)} />
                                  <Tab icon={<BookmarkIcon />} {...a11yProps(2)} />
                                  <Tab icon={<WorkspacePremiumIcon />} {...a11yProps(3)} />
                                </Tabs>
                              </Box>
                              {/*<---- SECCION PUBLICACIONES USUARIO ---->*/}
                              <CustomTabPanel value={section} index={0}>
                                  <PostProfileViewer id={id} userId={user.id} />
                              </CustomTabPanel>
                              {/*<--------- SECCION COMPARTIDOS --------->*/}
                              <CustomTabPanel value={section} index={1}>
                                  Item Two
                              </CustomTabPanel>
                              {/*<---------- SECCION GUARDADOS ----------> */}
                              <CustomTabPanel value={section} index={2}>
                                  Item Three
                              </CustomTabPanel>
                              {/*<----------- SECCION INSIGNIAS ---------> */}
                              <CustomTabPanel value={section} index={3}>
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

/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from "react";

/* <------------------- COMPONENTES FORM ----------------------> */
import PostForm from "@/components/form/PostForm.jsx";

/* <------------------ COMPONENTES VIEWER ---------------------> */
import HashtagsViewer from "@/components/viewer/HashtagsViewer.jsx";
import HomePostsViewer from "@/components/viewer/HomePostsViewer.jsx";

/* <------------------- COMPONENTES NAV  ----------------------> */
import NavBar from "@/components/nav/NavBar.jsx";
import SideNav from "@/components/nav/SideNav.jsx";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";

export default function Home() {
  // Desectructuracion datos de usuario que esta navegando (user.id).
  const { user } = useAuth();
  
  //<------------------------- MANEJO DE ACTUALIZACION/RENDERIZACIÓN  ------------------------>
  // Seteo de variable update por defecto: false.
  const [update, setUpdate] = useState(false);
  // Funcion encargada de invertir/cambiar el valor de variable `update`.
  const updatePosts = () => {
    setUpdate(!update);
  };

  //<---------------------------------- MANEJO DE DOCUMENTO  --------------------------------->
  useEffect(() => {
    document.title = "Inicio";
  });

  return (
    <main>
      {/*<-------- Barra de navegacion -------->*/}
      <NavBar userId={user.id} />
      {/*<------ Contenedor de secciones ------>*/}
      <div className="flex container mx-auto mt-4">
          {/*<------ Contenedor de secciones ------>*/}
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              {/*<----- Seccion de navegacion ----->*/}
              <div className="md:col-span-1 md:border-r-2 px-2 md:sticky md:top-0 md:self-start md:h-screen md:overflow-y-auto">
                <SideNav userId={user.id} />
              </div>

              {/*<------ Seccion de en medio ------>*/}
              <div className="md:col-span-2">
                <PostForm userId={user.id} updatePosts={updatePosts} />
                <HomePostsViewer userId={user.id} key={update} />
              </div>

              {/*<------ Seccion de hashtags ------>*/}
              <div className="md:col-span-1">
                <HashtagsViewer key={update}  />
              </div>
          </div>
      </div>
    </main>
  );
}

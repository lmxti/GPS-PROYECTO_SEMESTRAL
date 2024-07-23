import React from 'react'
/* <--------------------- COMPONENTES NAV ----------------------> */
import NavBar from "@/components/nav/NavBar";
import SideNav from "@/components/nav/SideNav.jsx";

/* <------------------ COMPONENTES VIEWER ---------------------> */
import ExplorePostsViewer from "@/components/viewer/ExplorePostsViewer";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";

export default function explore() {
  // Desectructuracion datos de usuario que esta navegando (user.id).
  const { user } = useAuth();
  
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
                <ExplorePostsViewer userId={user.id} />
              </div>

              {/*<------ Seccion de hashtags ------>*/}
              <div className="md:col-span-1">
              </div>
          </div>
      </div>
    </main>
  )
}

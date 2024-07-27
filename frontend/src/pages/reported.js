import React from "react";
/* <--------------------- COMPONENTES NAV ----------------------> */
import NavBar from "@/components/nav/NavBar";

/* <------------------ COMPONENTES VIEWER ---------------------> */
import ReportedPostsViewer from "@/components/viewer/ReportedPostsViewer";

/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from "@/context/AuthContext.jsx";

export default function reported() {
  // Desectructuracion datos de usuario que esta navegando (user.id).
  const { user } = useAuth();

  return (
    <main>
      {/*<-------- Barra de navegacion -------->*/}
      <NavBar userId={user.id} />
      <div className="flex container mx-auto mt-4 justify-center">
        <div className="grid grid-cols-12 gap-4 w-full">
          {/*<------ Sección de en medio ------>*/}
          <div className="col-span-10 md:col-span-10">
            <div className="text-center select-none">
              <h2 className="font-thin text-2xl">Gestión de Reportes</h2>
            </div>
            <ReportedPostsViewer userId={user.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

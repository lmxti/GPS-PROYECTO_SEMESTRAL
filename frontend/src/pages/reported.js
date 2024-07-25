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
                {/*<------ Seccion de en medio ------>*/}
                <div className="md:col-span-2">
                    <div className='text-center select-none'>
                        <h2 className='font-thin text-2xl'>Reportes</h2>
                        <p className='font-thin'>En está sección puedes encontrar contenido reportado</p>
                    </div>
                    <ReportedPostsViewer userId={user.id} />
                </div>
        </main>
    )
}
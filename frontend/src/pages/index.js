/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from 'react';

/* <---------------------- COMPONENTES -------------------------> */
import PostForm from '@/components/form/PostForm.jsx';
import HashtagsViewer from '@/components/viewer/HashtagsViewer.jsx'
import PostViewer from '@/components/viewer/PostViewer.jsx';

/* <---------------------- COMPONENTES  -------------------------> */
import NavBar from '@/components/nav/NavBar.jsx';
import SideNav  from '@/components/nav/SideNav.jsx';
import ResourcesViewer from '@/components/viewer/ResourcesViewer.jsx';


/* <----------------------- CONTEXTO  -----------------------> */
import { useAuth } from '@/context/AuthContext.jsx';



export default function Home() {

  const [update, setUpdate] = useState(false);
  
  const { user: { id: userId } } = useAuth();

  const updatePosts = () => {
    setUpdate(!update);
  };


  return (
    <main>
      <NavBar userId={userId}/>
      <div className = "grid grid-cols-5 ">

        <div className = "col-start-1 col-end-2 sticky top-0 h-screen overflow-y-auto">
            <SideNav/>
            <HashtagsViewer/>
            <ResourcesViewer/>
        </div>

        <div className = "col-start-2 col-end-5 space-y-4">
          <PostForm updatePosts={updatePosts} userId={userId}/>
          <PostViewer key={update} userId={userId}/>
        </div>


        <div className = "col-start-5 col-end-6">
        </div>
        
      </div>
    </main>
  );
}
 
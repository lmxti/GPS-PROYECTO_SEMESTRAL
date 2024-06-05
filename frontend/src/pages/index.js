/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from 'react';

/* <---------------------- COMPONENTES -------------------------> */
import PostForm from '@/components/form/PostForm.jsx';
import HashtagsTopics from '@/components/HashtagsTopics.jsx'
import PostViewer from '@/components/PostViewer.jsx';

/* <---------------------- COMPONENTES  -------------------------> */
import NavBar from '@/components/nav/NavBar.jsx';
import SideNav  from '@/components/nav/SideNav.jsx';
import Resources from '@/components/Resources';


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
            <HashtagsTopics/>
            <Resources/>
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
 
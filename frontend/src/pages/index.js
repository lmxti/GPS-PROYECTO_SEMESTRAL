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
      <div className = "flex container mx-auto mt-4">

        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>

          <div className='md:col-span-1 md:border-r-2 px-2'>
                <SideNav/>
                <HashtagsViewer/>
                <ResourcesViewer/>
          </div>

          <div className='md:col-span-2'>
            <PostForm updatePosts={updatePosts} userId={userId}/>
            <PostViewer key={update} userId={userId}/>
          </div>

          <div className='md:col-span-1'>

          </div>

        </div>
        
      </div>

    </main>
  );
}
 
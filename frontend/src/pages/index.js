/* <----------------------- FUNCIONES --------------------------> */
import { useState, useEffect } from 'react';

/* <---------------------- COMPONENTES -------------------------> */
import CreatePost from '@/components/CreatePost.jsx';
import HashtagsTopics from '@/components/HashtagsTopics.jsx'
import PostViewer from '@/components/PostViewer.jsx';

/* <---------------------- COMPONENTES  -------------------------> */
import NavBar from '@/components/nav/NavBar.jsx';
import SideNav  from '@/components/nav/SideNav.jsx';
import Resources from '@/components/Resources';






export default function Home() {

  const [update, setUpdate] = useState(false);

  const updatePosts = () => {
    setUpdate(!update);
  };

  return (
    <main>
      <NavBar/>
      <div className = "grid grid-cols-5 ">

        <div className = "col-start-1 col-end-2 sticky top-0 h-screen overflow-y-auto">
            <SideNav/>
            <HashtagsTopics/>
            <Resources/>
        </div>

        <div className = "col-start-2 col-end-5 space-y-4">
          <CreatePost updatePosts={updatePosts}/>
          <PostViewer key={update}/>
        </div>


        <div className = "col-span-1">
        </div>
        
      </div>
    </main>
  );
}
 
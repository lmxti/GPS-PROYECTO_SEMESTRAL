import { useRouter } from 'next/router';
import NavBar from '../components/NavBar.jsx';
import CreatePost from '@/components/CreatePost.jsx';
import HashtagsTopics from '@/components/HashtagsTopics.jsx'
import PostViewer from '@/components/PostViewer.jsx';

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className = "grid grid-cols-5 ">

        <div className = "col-start-1 col-end-2">
            <div className='bg-amber-400'>
                <h1>Enlaces</h1>
                <ul>
                  <li>Enlace1</li>
                  <li>Enlace2</li>
                  <li>Enlace3</li>
                </ul>
            </div>

            <div className='bg-amber-600'>
              <HashtagsTopics/>
            </div>

            <div className='bg-amber-500'>
              <h1>Recursos</h1>
              <ul>
                  <li>Recurso1</li>
                  <li>Recurso2</li>
                  <li>Recurso3</li>
                </ul>
            </div>
        </div>

        <div className = "bg-blue-300 col-start-2 col-end-5">
          <CreatePost/>
          <div className='bg-green-400 h-full'>
              <PostViewer/>
          </div>
        </div>


        <div className = "col-span-1">
          <h1>Sin contenido</h1>
        </div>
        
      </div>
    </main>
  );
}
 
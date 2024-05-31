import { useRouter } from 'next/router';
import NavBar from '../components/NavBar.jsx';
import CreatePost from '@/components/CreatePost.jsx';
import HashtagsTopics from '@/components/HashtagsTopics.jsx'

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className = "grid grid-cols-5">

        <div className = "col-start-1 col-end-2">
          
        </div>

        <div className = "bg-blue-300 col-start-2 col-end-5">
          <CreatePost/>
        </div>

        <div className = "col-span-1">
          <HashtagsTopics/>
        </div>
        
      </div>
    </main>
  );
}
 
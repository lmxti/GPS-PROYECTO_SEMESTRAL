
import { logout } from "../services/auth.service.js"
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter();

  return (
    <main>
      <h1>Hola mundo</h1>
      <button onClick={ () => { 
        logout() 
        router.push("/")}
      }>
        Cerrar sesion
      </button>
    </main>
  );
}

/* <----------------------- FUNCIONES -------------------------> */
import { useRouter } from 'next/router';

/* <----------------------- ICONOS --------------------------> */
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const SideNav = () => {
  const router = useRouter();

  return (
      <ul className='justify-center p-4 border-b-2'>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg '>
          <a href="" >
            <HomeIcon fontSize={"large"}/> Inicio
          </a>
        </li>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
          <a href="#">
            <PersonIcon fontSize={"large"}/> Perfil
          </a>
        </li>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
          <a href="#">
            <PersonSearchIcon fontSize={"large"}/> Buscar Usuarios
          </a>
        </li>
      </ul>

  )
}

export default SideNav
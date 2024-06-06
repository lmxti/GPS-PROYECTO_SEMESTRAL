

/* <----------------------- ICONOS --------------------------> */
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const SideNav = () => {
  return (
    <div className=' p-6 mx-4 border-b'>
      <ul className='space-y-4'>

        <li className='py-2 px-4 rounded transition hover:bg-zinc-100 '>
          <a href="#" >
            <HomeIcon fontSize={"large"}/> Inicio
          </a>
        </li>

        <li className='py-2 px-4 rounded transition hover:bg-zinc-100'>
          <a href="#">
            <PersonIcon fontSize={"large"}/> Perfil
          </a>
        </li>

        <li className='py-2 px-4 rounded transition hover:bg-zinc-100'>
          <a href="#">
            <PersonSearchIcon fontSize={"large"}/> Buscar Usuarios
          </a>
        </li>

      </ul>
    </div>
  )
}

export default SideNav
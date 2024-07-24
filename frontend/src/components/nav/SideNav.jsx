/* <----------------------- FUNCIONES -------------------------> */
import { useRouter } from 'next/router';
import Link from 'next/link';


import Divider from '@mui/material/Divider';

/* <----------------------- ICONOS UI ---------------------------> */
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

const SideNav = ( { userId }) => {

  const navLinks = [
    { href: "/", icon: <HomeOutlinedIcon className="h-8 w-8" />, label: "Inicio" },
    { href: "/explore", icon: <ExploreOutlinedIcon className="h-8 w-8" />, label: "Explorar" },
    { href: `/profile/${userId}`, icon: <PersonOutlineOutlinedIcon className="h-8 w-8" />, label: "Perfil" },
    // { href: "/search-users", icon: <PersonSearchOutlinedIcon className="h-8 w-8" />, label: "Buscar Usuarios" },

  ];

  const resourceLinks = [
    { href: "/about", icon: <InfoOutlinedIcon className="h-8 w-8" />, label: "Acerca de" },
    { href: "/#", icon: <HelpOutlineOutlinedIcon className="h-8 w-8" />, label: "Ayuda" },
    { href: "/privacy-policy", icon: <LockOutlinedIcon className="h-8 w-8" />, label: "Políticas de privacidad" },
    { href: "/#", icon: <DescriptionOutlinedIcon className="h-8 w-8" />, label: "Políticas de contenido" }
  ];

  return (
    <div className='md:sticky md:h-[calc(100vh-2rem)] md:overflow-y-auto pr-2'>
      <div className='sm:block p-6 mx-4'>
        <p className='font-thin text-2xl text-center mb-4'>Principal</p>
        <ul className='space-y-1'>
          {navLinks.map((link, index) => (
            <li key={index} className='flex items-center rounded-md text-sm transition-colors hover:bg-zinc-200'>
              <Link href={link.href} className='flex items-center w-full px-3 py-2'>
                {link.icon}
                <span className='ml-2'>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Divider/>
      <div className='hidden sm:block p-6 mx-4'>
        <p className='font-thin text-2xl text-center mb-4'>Recursos</p>
        <ul className='space-y-1'>
          {resourceLinks.map((link, index) => (
            <li key={index} className='flex items-center rounded-md text-sm transition-colors hover:bg-zinc-200'>
              <Link href={link.href} className='flex items-center w-full px-3 py-2'>
                {link.icon}
                <span className='ml-2'>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default SideNav;

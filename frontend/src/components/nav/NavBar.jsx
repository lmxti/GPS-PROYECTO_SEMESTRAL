/* <----------------------- FUNCIONES -------------------------> */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


/* <---------------------- COMPONENTES ------------------------> */
import UserAvatar from "../common/UserAvatar.jsx";


/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';

/* <----------------------- ICONOS --------------------------> */
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

/* <----------------------- SERVICIOS  -----------------------> */
import { logout } from "../../services/auth.service.js"
import { getUserInformation, getUserImage } from "../../services/user.service.js"


export default function PrimarySearchAppBar( { userId }) {

  const router = useRouter();

  const [dataUser, setDataUser] = useState('');
  const [imageUser, setImageUser] = useState('');

  const getDataUser = async () => {
    try {
      const response = await getUserInformation(userId);
      setDataUser(response.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( () => {
    getDataUser();
  },[]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';

  // Menu normal
  const renderMenu = (
    <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={()=>{
        router.push(`/profile/${userId}`);
        handleMenuClose();
      }}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
      <MenuItem onClick={ () => {
          logout()
          router.push('/auth');
        }
        }>Cerrar sesión

      </MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  // Menu movil
  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} id={mobileMenuId} keepMounted open={isMobileMenuOpen} onClose={handleMobileMenuClose}
       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>

        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p> 

      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>

    </Menu>
  );



  return (
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" className='bg-zinc-800'>
        <Toolbar>
        
        {/* Texto barra de navegacion */}
          {/* <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block', fontStyle:'oblique' } }}>
            FORUM
          </Typography> */}
          <Avatar alt="Logo" src="/icons/ovni1.png" sx={{ width: 60, height: 60 }} />


        {/* Barra de busqueda */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }}/>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Mensajes, notificaciones y Avatar */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            <IconButton size="large" color="inherit" onClick={() => router.push("/")}>
                <HomeIcon />
            </IconButton>

            {/* Mensajes */}
            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}

            {/* Notificaciones*/}
            {/* <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}

            {/* Favoritos*/}
            {/* <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={2} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton> */}

            {/* Avatar */}
            <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
              <UserAvatar userId={userId} />
            </IconButton>
            
          </Box>

      	  {/* Boton mas opciones (tres puntos) en pantalla mas pequeña */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );


}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

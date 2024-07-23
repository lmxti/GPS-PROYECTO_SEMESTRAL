// src/components/PrimarySearchAppBar.jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import UserAvatar from "../common/UserAvatar.jsx";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import { logout } from "../../services/auth.service.js";
import { search } from '@/services/search.service.js';
import { useAuth } from "@/context/AuthContext";
import { Search, SearchIconWrapper, StyledInputBase, SearchResultsContainer  } from '../../styles/components/navbar.styles.js';
import SearchResultItem from '../common/SearchResultItem.jsx';

export default function PrimarySearchAppBar() {
  const router = useRouter();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearch = async (searchQuery) => {
    try {
      setError(null);
      const data = await search(searchQuery);
      console.log(data.data.data);
      setResults(data.data.data);
    } catch (err) {
      setError('Ocurrió un error al buscar. Por favor, intenta de nuevo.');
      setResults([]);
    }
  };

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    // Limpiar el timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Establecer un nuevo timeout
    const timeoutId = setTimeout(() => {
      handleSearch(newQuery);
    }, 1000); // Ajusta el tiempo según sea necesario

    setSearchTimeout(timeoutId);
  };

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

  const renderMenu = (
    <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={() => {
        router.push(`/profile/${user.id}`);
        handleMenuClose();
      }}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
      <MenuItem onClick={() => {
          logout();
          router.push('/auth');
        }}>Cerrar sesión
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} id={mobileMenuId} keepMounted open={isMobileMenuOpen} onClose={handleMobileMenuClose}
       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  
       transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
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
      <AppBar position="sticky" className='bg-zinc-700'>
        <Toolbar>
          <Avatar className='cursor-pointer hover:bg-zinc-700 p-1 transition' alt="Logo" src="/icons/ovni1.png" sx={{ width: 60, height: 60 }} onClick={() => { router.push('/')}} />
          <Box sx={{ position: 'relative' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={handleQueryChange}/>
            </Search>
            {query && (
              <SearchResultsContainer>
                {results.length ? (
                  results.map(user => (
                    <SearchResultItem
                      key={user._id}
                      name={user.name}
                      id={user._id}
                      username={user.username}
                    />
                  ))
                ) : (
                  <Typography variant="body2" sx={{ p: 2 }}>No se encontraron resultados.</Typography>
                )}
              </SearchResultsContainer>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" color="inherit" onClick={() => router.push("/")}>
              <HomeIcon />
            </IconButton>
            <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
              <UserAvatar userId={user.id} />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {user && renderMobileMenu}
      {user && renderMenu}
    </Box>
  );
}

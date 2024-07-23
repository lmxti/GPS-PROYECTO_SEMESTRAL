// src/styles/components/navbar.styles.js

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// Estilo para la barra de búsqueda
export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%', // Asegúrate de que ocupe todo el ancho disponible
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '100%',
  },
}));

// Estilo para el icono de búsqueda dentro de la barra
export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Estilo para la entrada de búsqueda
export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Estilo para los resultados de búsqueda
export const SearchResultsContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  color: '#ffffff',
  borderRadius: '0 0 8px 8px',
  backgroundColor: 'rgb(63 63 70)',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%', // Asegúrate de que ocupe todo el ancho disponible
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '100%',
  },// Asegúrate de que el contenedor de resultados tenga el mismo ancho que la barra de búsqueda
}));


// src/components/SearchResultItem.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import UserAvatar from './UserAvatar';

import { useRouter } from 'next/router';


const SearchResultItem = ({ name, id, username }) => {
  // Inicialización de Hook useRouter en `router` para manejar navegación.
  const router = useRouter();
  return (
    <Box onClick={() => router.push(`/profile/${id}`)} className="hover:bg-zinc-500" display="flex" alignItems="center" padding={2} sx={{ cursor: 'pointer' }}>
      <UserAvatar userId={id} />
      <Typography sx={{ ml: 2 }}>{name}</Typography>
      <Typography sx={{ ml: 1 }} className='text-xs tracking-wide'>({username})</Typography>
    </Box>
  );
};

export default SearchResultItem;
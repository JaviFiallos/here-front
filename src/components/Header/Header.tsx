// src/components/Header/Header.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default Header;

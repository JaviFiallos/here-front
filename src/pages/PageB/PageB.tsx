// src/pages/PageB.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PageB: React.FC = () => {
  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Página B
        </Typography>
        <Typography variant="body1">
          Contenido de la Página B dentro del Dashboard.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit blanditiis, doloribus voluptates, corporis libero sint ea quasi nemo possimus labore, consectetur laborum. Saepe facere libero voluptates ipsum fugit nemo fuga.
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur quis hic iusto qui quos laudantium voluptatibus cupiditate ipsam repudiandae asperiores atque, officiis quo, optio id ab corporis neque labore sint.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum iste quam asperiores ratione fugit odio facilis eligendi obcaecati officia ea tempore harum, exercitationem ipsa eius necessitatibus nisi non laboriosam aperiam.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit blanditiis, doloribus voluptates, corporis libero sint ea quasi nemo possimus labore, consectetur laborum. Saepe facere libero voluptates ipsum fugit nemo fuga.
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur quis hic iusto qui quos laudantium voluptatibus cupiditate ipsam repudiandae asperiores atque, officiis quo, optio id ab corporis neque labore sint.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum iste quam asperiores ratione fugit odio facilis eligendi obcaecati officia ea tempore harum, exercitationem ipsa eius necessitatibus nisi non laboriosam aperiam.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit blanditiis, doloribus voluptates, corporis libero sint ea quasi nemo possimus labore, consectetur laborum. Saepe facere libero voluptates ipsum fugit nemo fuga.
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur quis hic iusto qui quos laudantium voluptatibus cupiditate ipsam repudiandae asperiores atque, officiis quo, optio id ab corporis neque labore sint.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum iste quam asperiores ratione fugit odio facilis eligendi obcaecati officia ea tempore harum, exercitationem ipsa eius necessitatibus nisi non laboriosam aperiam.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PageB;

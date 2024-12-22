import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Box, Typography} from '@mui/material';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
      <AppBar
          position="static"
          sx={{
            backgroundColor: '#262626',
            mb: 5,
            boxShadow: 'none',
          }}
      >
        <Toolbar
            sx={{
              justifyContent: 'space-between',
            }}
        >
          <Link href="/admin/posts">
          <Typography
              sx={{
                fontWeight: 'bold'
              }}
          >
            Blog
          </Typography>
          </Link>
          <Box>
          </Box>
          <Link href="contact">
          <Typography
              sx={{
                fontWeight: 'bold',
              }}
          >
            お問い合わせ
          </Typography>
          </Link>
        </Toolbar>
      </AppBar>
  );
};
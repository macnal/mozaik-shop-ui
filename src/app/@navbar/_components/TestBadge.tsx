import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

type Props = {
  sx?: SxProps<Theme>;
  text?: string;
};

export default function TestBadge({ sx, text = 'WERSJA TESTOWA' }: Props) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 45,
        left: 24,
        bgcolor: 'error.main',
        color: 'common.white',
        px: 1,
        py: '2px',
        borderRadius: 1,
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: '0.02em',
        zIndex: 1300,
        pointerEvents: 'none',
      }}
    >
      {text}
    </Box>
  );
}


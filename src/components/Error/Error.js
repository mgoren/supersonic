import { useEffect } from 'react';
import { scrollToTop } from 'utils';
import { Box } from '@mui/material';

export default function Error({ error }) {
  useEffect(() => { scrollToTop() },[]);
  return (
    <Box sx={{ p: 2, backgroundColor: 'var(--color-error)', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
      {error}
    </Box>
  );
}
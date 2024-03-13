import { useOrder } from 'components/OrderContext';
import { Box, Button } from '@mui/material';
import { StyledPaper } from 'components/Layout/SharedStyles';

export default function Confirmation() {
  const { startOver } = useOrder();

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <>
          <div />
          <Button variant='outlined' color='warning' onClick={startOver}>Start another registration</Button>
          <div />
        </>
      </Box>
    </StyledPaper>
  );
}

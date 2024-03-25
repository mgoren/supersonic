import { useOrder } from 'components/OrderContext';
import { Box, Button } from '@mui/material';
import { StyledPaper } from 'components/Layout/SharedStyles';
import Receipt from "components/Receipt";

export default function Confirmation() {
  const { order, startOver } = useOrder();

  return (
    <>
      <StyledPaper>
        <Receipt order={order} isPurchaser={true} />
      </StyledPaper>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <>
            <div />
            <Button variant='outlined' color='warning' onClick={startOver}>Start another registration</Button>
            <div />
          </>
        </Box>
      </StyledPaper>
    </>
  );
}

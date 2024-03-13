import { useOrder } from 'components/OrderContext';
import { StyledPaper } from 'components/Layout/SharedStyles';
import { Typography, Divider, Box } from "@mui/material";
import { MyStepper } from 'components/MyStepper';
import config from 'config';
const { TITLE } = config;

export default function Header({ titleText = TITLE, children }) {
  const { currentPage } = useOrder();

  return (
    <StyledPaper>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {titleText}
      </Typography>

      {currentPage !== 'confirmation' &&
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <MyStepper currentPage={currentPage} />
        </Box>
      }

      <Divider component="hr" sx={{borderBottomWidth: 4, mb: 2 }}/>
      {children}
    </StyledPaper>
  );
}

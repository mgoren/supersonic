import { StyledPaper } from 'components/Layout/SharedStyles';
import { Typography, Divider, Hidden } from "@mui/material";
import { MyStepper } from 'components/MyStepper';
import config from 'config';
const { TITLE } = config;

export default function Header({ titleText = TITLE, currentPage, children }) {
  return (
    <StyledPaper>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {titleText}
      </Typography>

      {currentPage !== 'confirmation' &&
        <Hidden smDown>
          <MyStepper currentPage={currentPage} />
        </Hidden>
      }

      <Divider component="hr" sx={{borderBottomWidth: 4, mb: 2 }}/>
      {children}
    </StyledPaper>
  );
}

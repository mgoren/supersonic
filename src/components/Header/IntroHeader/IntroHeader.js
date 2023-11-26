import { mailtoLink } from "utils";
import { Typography } from '@mui/material';
import { StyledLink } from 'components/Layout/SharedStyles';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function IntroHeader() {
  return (
    <>
      <Typography gutterBottom={true}>Questions? Email <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.</Typography>
    </>
  );
}

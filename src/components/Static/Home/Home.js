import { Typography, Box } from '@mui/material';
import { StyledLink, StyledPaper, PageTitle, SectionDivider, Paragraph } from 'components/Layout/SharedStyles';
import { mailtoLink} from 'utils';
import config from 'config';
const { EVENT_TITLE, EVENT_LOCATION, EVENT_LOCATION_2, EVENT_DATE, EMAIL_CONTACT } = config;

export default function Home() {

  return (
    <StyledPaper extraStyles={{ maxWidth: 750 }} align="center">
      <PageTitle>
        {EVENT_TITLE}<br />
        {EVENT_LOCATION}, {EVENT_LOCATION_2}<br />
        {EVENT_DATE}
      </PageTitle>

      <Box mt={-5} mb={4}>
        <img src={process.env.PUBLIC_URL + '/supersonic/dancer.jpg'} alt='' style={{ width: "100%", height: "auto" }} />
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        <strong>We are a zesty, high-energy dance weekend for experienced dancers.</strong><br />
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Music by <StyledLink internal={true} to="/staff#band1">Gallimaufry</StyledLink> and <StyledLink internal={true} to="/staff#band2">Joyride</StyledLink>
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Calling by <StyledLink internal={true} to="/staff#caller1">Seth Tepfer</StyledLink> and <StyledLink internal={true} to="/staff#caller2">Cis Hinkle</StyledLink><br />
        Role terms will be Larks and Robins.
      </Typography>

      <Paragraph>
        Registration: $120-240 sliding scale ($180 break-even)
      </Paragraph>

      <Paragraph sx={{ mb: 2 }}>
        Supersonic will follow mask guidelines of the weekly Seattle contras.<br />
        Currently, masks are encouraged but not required. This is subject to change.<br />
        Dancers are <strong>strongly encouraged</strong> to take a COVID test before arriving.<br />
        Please do not attend if you are feeling unwell.<br />
        See <StyledLink internal={true} to='/about#wellness'>here</StyledLink> for the full wellness policy.<br />
      </Paragraph>

      <Paragraph>
        You will need to sign a <StyledLink to={process.env.PUBLIC_URL + '/supersonic/waiver.pdf'}>waiver</StyledLink> and email it to <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>. (If you attended Supersonic last year and already signed the waiver, you do not need to do so again.)<br />
      </Paragraph>

      <Paragraph>
        Supersonic is a fragrance-free event. Please use only fragrance-free products.
      </Paragraph>

      <SectionDivider/>

      <Paragraph>
        <strong>We will be dancing primarily complex contras with limited or no walkthroughs.</strong><br />
        Many participants easily dance both roles and role switching is common.
      </Paragraph>

      <Paragraph>
        Supersonic Contra Dance Weekend gives experienced dancers the opportunity to explore ways in which to challenge themselves and improve their skills as dance partners while experiencing complex dances and immense joy.
      </Paragraph>

      <Paragraph>
        We begin the weekend with no walkthrough contra corners. Are you comfortable navigating complex dances often with no walkthroughs or hash calls? Do you recover quickly from mistakes? If you answered yes, this weekend is for you.
      </Paragraph>

      <SectionDivider/>

      <Typography variant="h5" fontStyle="italic" gutterBottom>
        <StyledLink internal={true} to="/registration">Registration open</StyledLink>
      </Typography>
    </StyledPaper>
  );
}

import { StyledPaper, StyledLink, Title } from 'components/Layout/SharedStyles';
import { Typography, Box } from '@mui/material';
import { mailtoLink } from 'utils';
import config from 'config';
const { EMAIL_CONTACT } = config;

export function PaymentExplanation() {
  return (
    <StyledPaper>
      <Title>Where does my money go?</Title>
      <Box sx={{ mb: 2 }}>
        <img src={process.env.PUBLIC_URL + '/supersonic/piechart.png'} alt="" style={{ maxWidth: '100%' }} />
      </Box>
      <Typography><strong>Talent & Staff (stipend/travel/accomodations):</strong> 60% of the budget &mdash; we believe in compensating our people at the higher end of the going rate.</Typography>
      <Typography><strong>Hall Rental/Equipment:</strong> 25% of the budget</Typography>
      <Typography><strong>Snacks/Supplies:</strong> 10% of the budget</Typography>
      <Typography><strong>Administrative Costs:</strong> 5% of the budget</Typography>

      <Title sx={{mt: 4}}>Sliding Scale Pay-What-You-Can</Title>
      <Typography>Supersonic is committed to giving dancers the opportunity to experience our flight regardless of financial situation. However, Supersonic is not affiliated with an organization and has no source for funding except from you, our dancers, with your registration fee. The break-even cost per dancer is $180.</Typography>

      <Title sx={{mt: 4}}>Work-Trade</Title>
      <Typography>There are a few work-trade positions available for this year. Contact <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink> for info.</Typography>

      <Title sx={{mt: 4}}>Scale (per person)</Title>
      <Typography>$120 minimum</Typography>
      <Typography>$180 break-even &mdash; this is the amount needed per attendee to cover costs.</Typography>
      <Typography>$240 &mdash; allow one dancer to attend at the low end of the scale.</Typography>

      <Typography sx={{mt: 2}}>If your financial situation allows you to contribute above $240, it will help make the camp sustainable and support work-trade positions.</Typography>
    </StyledPaper>
  );
}

export function SlidingScaleSummaryExplanation() {
  return (
    <>
      <Typography>$120 minimum</Typography>
      <Typography>$180 break-even &mdash; this is the amount needed per attendee to cover costs.</Typography>
      <Typography>$240 &mdash; allow one dancer to attend at the low end of the scale.</Typography>
    </>
  )
}

import { Box } from '@mui/material';
import { StyledPaper, PageTitle, Paragraph, SectionDivider, Header } from 'components/Layout/SharedStyles';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Staff() {
  const location = useLocation();
  useEffect(() => {
    const element = document.getElementById(location.hash.replace('#', ''));
    if (element) element.scrollIntoView();
  }, [location]);

  return (
    <StyledPaper extraStyles={{ maxWidth: 750 }}>
      <PageTitle>Bands & Callers</PageTitle>

      <Box>
        <Header id="caller1">Calling by <em>Seth Tepfer</em></Header>
        <Box sx={{ mt: 2, pr: 4, float: { xs: 'none', sm: 'left' } }}>
          <img src={process.env.PUBLIC_URL + '/supersonic/SethTepfer.jpg'} alt="Seth Tepfer" />
        </Box>
        <Paragraph sx={{ pt: 1, mb: 0 }}>
          Seth Tepfer returns to Supersonic, bringing his joy, hash calling, and complex contras to send us into orbit. 
        </Paragraph>
      </Box>
      <Box sx={{ clear: 'both' }} />

      <Box sx={{ mt: 6 }}>
        <Header id="caller2">Calling by <em>Cis Hinkle</em></Header>
        <Box sx={{ mt: 2, pl: { xs: 'none', sm: 4 }, float: { xs: 'none', sm: 'right' } }}>
          <img src={process.env.PUBLIC_URL + '/supersonic/CisHinkle.jpg'} alt="Cis Hinkle" />
        </Box>
        <Paragraph sx={{ pt: 1, mb: 0 }}>
          We welcome Cis Hinkle back to Supersonic! Cis has delighted contra dancers with her skilled teaching, welcoming manner, playful enthusiasm, and masterful selection of dances.
        </Paragraph>
      </Box>
      <Box sx={{ clear: 'both' }} />

      <SectionDivider />

      <Header id="band1">Music by <em>Gallimaufry</em></Header>
      <Box>
        <Box sx={{ mt: 2, pl: { xs: 'none', sm: 4 }, float: { xs: 'none', sm: 'right' } }}>
          <img src={process.env.PUBLIC_URL + '/supersonic/Gallimaufry.png'} alt="Gallimaufry" style={{ width: 300 }} />
        </Box>
        <Paragraph sx={{ pt: 1, mb: 0 }}>
          Gallimaufry was founded in 2010 at Oberlin College by Brian Lindsay and Alex Sturbaum. Joining forces with Ness Smith-Savedoff (drums), Donal Sheets (cello, guitar), and Arthur Davis (piano, banjo, trumpet, vocals), this quintet spent four years as Oberlin's house band and has delighted dancers throughout the Midwest and New England with their high-energy dance tunes, eclectic variety, and soaring harmonies. Incorporating elements of funk, rock, and traditional music of all stripes, Gallimaufry is a band not to be missed.
        </Paragraph>
      </Box>
      <Box sx={{ clear: 'both' }} />

      <Header id="band2">Music by <em>Joyride</em></Header>
      <Box>
        <Box sx={{ mt: 2, pr: { xs: 'none', sm: 4 }, float: { xs: 'none', sm: 'left' } }}>
          <img src={process.env.PUBLIC_URL + '/supersonic/Joyride.png'} alt="Joyride"  style={{ width: 300 }} />
        </Box>
        <Paragraph sx={{ pt: 1, mb: 0 }}>
          Joyride is a Portland, Oregon contra dance band known for fun, skilled play, tunes fit to dance figures, and ringing, rocking, gorgeous melodies that make you want to move. George Penk’s fiddle, Erik Weberg’s flute, harmonica, and bombarde, Sue Songer’s piano and fiddle, and Jeff Kerssen-Griep’s guitar and percussion breathe big life into modern and traditional tunes for dances, weekends, and festivals.
        </Paragraph>
      </Box>
      <Box sx={{ clear: 'both' }} />
    </StyledPaper>
  );
}

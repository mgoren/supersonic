import { Box, List, ListItem } from '@mui/material';
import { StyledPaper, StyledLink, PageTitle, Header } from 'components/Layout/SharedStyles';

export default function Schedule() {

  return (
    <StyledPaper extraStyles={{ maxWidth: 750 }}>
      <PageTitle>
        Itinerary
      </PageTitle>

      <Box mt={-5} mb={4}>
        <img src={process.env.PUBLIC_URL + '/supersonic/instruments.jpg'} alt='' style={{ width: "100%", height: "auto" }} />
      </Box>

      <Header>
        Supersonic Contra Dance Wekeend Itinerary
      </Header>
      <List>
        <ListItem>2024 &mdash; <StyledLink to={process.env.PUBLIC_URL + '/supersonic/supersonic-schedule-2024.pdf'}>Supersonic Contra Dance Weekend Schedule</StyledLink></ListItem>
      </List>

      <Header>
        Past Flights
      </Header>
      <List>
        <ListItem>2023 &mdash; No dance weekend</ListItem>
        <ListItem>2022 &mdash; No dance weekend</ListItem>
        <ListItem>2021 &mdash; No dance weekend</ListItem>
        <ListItem>2020 &mdash; Elixir and the Syncopaths with Nils Fredland and Seth Tepfer</ListItem>
        <ListItem>2019 &mdash; Supertrad and The Dam Beavers and Cis Hinkle and Seth Tepfer</ListItem>
        <ListItem>2018 &mdash; Genticorum and Contra Sutra with callers Seth Tepfer and Deb Comly</ListItem>
      </List>
    </StyledPaper>
  );
}

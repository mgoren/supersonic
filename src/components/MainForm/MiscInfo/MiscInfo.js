import { useEffect } from 'react';
import { scrollToTop } from 'utils.js';
import { Input, CheckboxInput } from '../Input';
import { StyledPaper, Title } from 'components/Layout/SharedStyles';
import { Box } from '@mui/material';
import config from 'config';
const { SCHOLARSHIP_OPTIONS, VOLUNTEER_OPTIONS, SHARE_OPTIONS, YES_NO_OPTIONS } = config;

export default function MiscInfo() {
  useEffect(() => { scrollToTop(); },[])
  return (
    <StyledPaper className='MiscInfo'>
      <Box sx={{ mb: 6 }}>
        <Title>What information do you want in the roster?</Title>
        <CheckboxInput
          name='share'
          options={SHARE_OPTIONS}
        />
      </Box>

      <Box sx={{ mb: 6 }}>
        <Title>Carpool</Title>
        <CheckboxInput
          label='Do you want your city, state, zip, and email shared for carpooling?'
          name='carpool'
          options={YES_NO_OPTIONS}
        />
      </Box>

      <Box sx={{ mb: 6 }}>
        <Title>Volunteering</Title>
        <CheckboxInput
          label='Do you want to volunteer to help out over the weekend?  Jobs might include sweeping or checking paper products stashed in the bathrooms.'
          name='volunteer'
          options={VOLUNTEER_OPTIONS}
        />
      </Box>

      <Box sx={{ mb: 6 }}>
        <Title>Scholarships (limited availability)</Title>
        <CheckboxInput
          label="We feel we've kept the price of camp remarkably low.  However, if you are limited financially, we have a small number of half price scholarships available for camp. If you'd like to be considered for one of these, please let us know."
          name='scholarship'
          options={SCHOLARSHIP_OPTIONS}
        />
      </Box>

      <Title>Comments</Title>
      <Input
        type='textarea'
        name='comments'
        label="Please tell us any special requests or information we should know regarding your registration. This might include non-dancers who want to attend camp but want a badge or other special needs, for example."
      />
    </StyledPaper>
  );
}

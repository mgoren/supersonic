import { useEffect } from 'react';
import { EMAIL_CONTACT, COVID_POLICY_URL } from 'config';
import { mailtoLink, websiteLink, scrollToTop } from 'utils';
import OrderSummary from 'components/OrderSummary';
import { StyledLink } from 'components/Layout/SharedStyles';
import { Divider, Typography } from '@mui/material';

export default function Receipt({ order }) {
  useEffect(() => { scrollToTop() },[]);
  return(
    <>
      <p>Thanks, {order.people[0].first}!</p>
      {order.electronicPaymentId === 'check' ? <CheckReceipt order={order}/> : <PaypalReceipt order={order }/>}
    </>
  );
}

function CheckReceipt({ order }) {
  return (
    <>
      <Typography component='p' color='error'>
        <strong>Your registration is not yet complete!</strong><br />
        Please send a check for ${order.total} to secure your spot.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Make your check out to Supersonic Contra Dance Weekend, write your name in the memo area, and mail to:
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Karen Marshall<br />
        Supersonic Contra Dance Weekend<br />
        PO Box 1173<br />
        Anacortes, WA 98221
      </Typography>

      <SharedReceipt />
      
      <Divider component="hr" sx={{borderBottomWidth: 4, my: 4}}/>
      <Typography component='p' variant="h6" gutterBottom={true}>Registration Information:</Typography>
      <OrderSummary order={order} currentPage='confirmation' />
    </>
  );
}

function PaypalReceipt({ order }) {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        We're excited to have you attend this year's Supersonic. 
        Your payment for ${order.total} has been successfully processed. 
      </Typography>

      <SharedReceipt />

      <Divider component="hr" sx={{borderBottomWidth: 4, my: 4}}/>
      <Typography component='p' variant="h6" gutterBottom={true}>Registration Information:</Typography>
      <OrderSummary order={order} currentPage='confirmation' />
    </>
  );
}

export function AdditionalPersonReceipt({ order }) {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        We're excited to welcome you to the 2024 Supersonic Contra Dance Weekend. 
      </Typography>

      <SharedReceipt />
    </>
  )
}

export function SharedReceipt() {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        Please sign <StyledLink to='https://www.supersoniccontra.com/supersonic/supersonic-waiver.pdf'>this waiver</StyledLink> and email it to <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.<br />
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Supersonic will follow the mask guidelines of the weekly Seattle contra dances.<br />
        As of November 1, well-fitting face masks are required.<br />
        Please do not attend if you are feeling unwell.<br />
        See <StyledLink to={websiteLink(COVID_POLICY_URL)}>here</StyledLink> for the full Covid and refund policies.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Supersonic is a fragrance-free event. Please use only fragrance-free products.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        If you offered or requested housing, you will receive an email from Kristin, our housing coordinator.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        If you are able to volunteer, please contact <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Questions:  Contact Karen at <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.
      </Typography>
    </>
  );
}

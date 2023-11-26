import { useEffect } from 'react';
import { scrollToTop, websiteLink } from 'utils';
import OrderSummary from 'components/OrderSummary';
import { Divider, Typography } from '@mui/material';
import { StyledLink } from 'components/Layout/SharedStyles';
import config from 'config';
const { COVID_POLICY_URL, CHECK_TO, CHECK_ADDRESS } = config;

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
        <strong>You are not yet registered!</strong><br />
        Paying on time can increase your chance of being accepted.<br />
        Please send a check for ${order.total}.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Make your check out to {CHECK_TO}
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        <span dangerouslySetInnerHTML={{ __html: CHECK_ADDRESS }}></span>
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        We will be in touch soon to confirm your acceptance into camp, once we receive your payment!
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
        Thank you for registering for Corvallis Contra Weekend 2024!<br />
        Your payment for ${order.total} has been successfully processed.<br />
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
        Thank you for registering for the 2024 Contra Corvallis Dance Weekend. 
      </Typography>

      <SharedReceipt />
    </>
  )
}

export function SharedReceipt() {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        <strong>We will send an acceptance or wait-list notification before Christmas.</strong><br />
        If you have not heard from us by December 23rd, please let us know.<br />
        If you need early acceptance to finalize your travel arrangements, be<br />
        sure to let us know: We love dancing with folks from other communities!
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Masking will be required.<br />
        See <StyledLink to={websiteLink(COVID_POLICY_URL)}>here</StyledLink> for the full Covid policy.<br />
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Corvallis Contra Dance Weekend is a fragrance-free event.<br />
        Please use only fragrance-free products.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Hope to dance with you soon at the 2024 Corvallis Contra Weekend!
      </Typography>
    </>
  );
}

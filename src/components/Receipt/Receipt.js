import { useEffect } from 'react';
import { scrollToTop, websiteLink } from 'utils';
import OrderSummary, { PersonContainerDotted } from 'components/OrderSummary';
import { Divider, Typography } from '@mui/material';
import { StyledLink } from 'components/Layout/SharedStyles';
import config from 'config';
const { COVID_POLICY_URL, CHECK_TO, CHECK_ADDRESS, EVENT_TITLE, PAYMENT_DUE_DATE, DIRECT_PAYMENT_URL } = config;

// relies on passing order as prop to ensure is updated
export default function Receipt({ order }) {
  useEffect(() => { scrollToTop() },[]);
  return(
    <>
      <p>Thanks, {order.people[0].first}!</p>
      {order.paymentId === 'check' ? <CheckPaymentReceipt order={order}/> : <ElectronicPaymentReceipt order={order }/>}
    </>
  );
}

function CheckPaymentReceipt({ order }) {
  const total = order.people.reduce((total, person) => total + person.admission, 0) + order.donation;
  return (
    <>
      <Typography component='p' color='error'>
        <strong>You are not yet registered!</strong><br />
        Paying on time can increase your chance of being accepted.<br />
        Please send a check for {order.deposit ? `at least $${order.deposit} to hold` : `$${total} to secure`} your spot.<br />
        (Or you can still pay electronically <StyledLink to={websiteLink(DIRECT_PAYMENT_URL)}>here</StyledLink>.)
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Make your check out to {CHECK_TO}
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        {CHECK_ADDRESS}
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

function ElectronicPaymentReceipt({ order }) {
  const total = order.people.reduce((total, person) => total + person.admission, 0) + order.donation;
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        Thank you for registering for the {EVENT_TITLE}!<br />
        Your payment for ${order.deposit || total} has been successfully processed.<br />
        {order.deposit > 0 &&
          <strong>
            Your balance is due by {PAYMENT_DUE_DATE}.<br />
            To pay it, please go to <StyledLink to={websiteLink(DIRECT_PAYMENT_URL)}>{DIRECT_PAYMENT_URL}</StyledLink>.
          </strong>
        }
      </Typography>

      <SharedReceipt />

      <Divider component="hr" sx={{borderBottomWidth: 4, my: 4}}/>
      <Typography component='p' variant="h6" gutterBottom={true}>Registration Information:</Typography>
      <OrderSummary order={order} currentPage='confirmation' />
    </>
  );
}

export function AdditionalPersonReceipt({ order, person }) {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        Thank you for registering for the {EVENT_TITLE}.
      </Typography>

      {order.paymentId === 'check' &&
        <Typography component='p' sx={{ mt: 2 }}>
          Your spot in camp will be confirmed once we receive payment for your registration.
        </Typography>
      }

      {order.deposit > 0 && order.paymentId !== 'check' &&
        <Typography component='p' sx={{ mt: 2 }}>
          Your spot in camp is reserved. The balance of your registration fee is due by {PAYMENT_DUE_DATE}.
        </Typography>
      }

      <SharedReceipt />

      <Divider component="hr" sx={{borderBottomWidth: 4, my: 4}}/>
      <Typography component='p' variant="h6" gutterBottom={true}>Registration Information:</Typography>
      <PersonContainerDotted person={person} />
    </>
  )
}

function SharedReceipt() {
  return (
    <>
      <Typography component='p' sx={{ mt: 2 }}>
        See <StyledLink to={websiteLink(COVID_POLICY_URL)}>here</StyledLink> for the full Covid policy.<br />
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        {EVENT_TITLE} is a fragrance-free event.<br />
        Please use only fragrance-free products.
      </Typography>

      <Typography component='p' sx={{ mt: 2 }}>
        Hope to dance with you soon at the {EVENT_TITLE}!
      </Typography>
    </>
  );
}

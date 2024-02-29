import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import Loading from 'components/Loading';
import config from 'config';
const { CHECK_ADDRESS, CHECK_TO, SANDBOX_MODE } = config;

export default function Check({ saveOrderToFirebase, processing, setOrder }) {
  const [verified, setVerified] = useState(SANDBOX_MODE);

  setTimeout(() => {
    setVerified(true);
  }, 5000);

  const handleRegister = async () => {
    const order = await saveOrderToFirebase();
    if (order) {
      setOrder({ ...order, paymentId: 'check' })
    }
  }

  return (
    <section>
      {!processing &&
        <>
          <Typography sx={{ mt: 2 }}>
            Make your check out to {CHECK_TO}<br />
            Write your name in the memo area, and mail to:
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {CHECK_ADDRESS }
          </Typography>

          {!verified && <Loading />}
          <Button variant='contained' color='success' disabled={!verified} onClick={handleRegister} sx={{ mt: 4, mb: 2 }}>
            Register and agree to send a check
          </Button>
        </>
      }
    </section>
  );
}

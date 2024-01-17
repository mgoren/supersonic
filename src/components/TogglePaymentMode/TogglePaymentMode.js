import { Typography, Button } from '@mui/material';
import config from 'config';
const { PAYMENT_METHODS } = config;

const switchToCheckText = '(or pay by check)';
const switchToPaypalText = '(or view online payment options)';

export default function TogglePaymentMode({ paymentMethod, setPaymentMethod, setError }) {
  const text = paymentMethod === 'check' ? switchToPaypalText : switchToCheckText;
  const togglePaymentMethod = () => {
    setError(null);
    setPaymentMethod(paymentMethod === 'check' ? PAYMENT_METHODS[0] : 'check');
  };

  return (
    <>
      {PAYMENT_METHODS.includes('check') &&
        <Typography align='center'>
          <Button size='small' color='secondary' sx={{ my: 2 }} onClick={() => togglePaymentMethod()}>
            {text}
          </Button>
        </Typography>
      }
    </>
  );
}

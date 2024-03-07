import { useState, useEffect, useCallback } from "react";
import { useOrder } from 'components/OrderContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { renderToStaticMarkup } from 'react-dom/server';
import { scrollToTop, warnBeforeUserLeavesSite, fullName } from 'utils';
import PaypalCheckoutButton from 'components/PaypalCheckoutButton';
import Check from "components/Check";
import Loading from 'components/Loading';
import Receipt, { AdditionalPersonReceipt } from 'components/Receipt';
import TogglePaymentMode from 'components/TogglePaymentMode';
import ButtonRow from 'components/ButtonRow/index.js';
import { StyledPaper, Title } from 'components/Layout/SharedStyles';
import { Hidden } from '@mui/material';
import { MyMobileStepper } from 'components/MyStepper';
import StripeCheckoutWrapper from "components/StripeCheckoutWrapper";
import config from 'config';
const { PAYMENT_METHODS, EMAIL_CONTACT, NUM_PAGES } = config;
const functions = getFunctions();
const savePendingOrder = httpsCallable(functions, 'savePendingOrder');
const saveFinalOrder = httpsCallable(functions, 'saveFinalOrder');

export default function Checkout({ setError, setCurrentPage }) {
  const { order, setOrder } = useOrder();
  const [paying, setPaying] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [paypalButtonsLoaded, setPaypalButtonsLoaded] = useState(false);

  useEffect(() => { scrollToTop() },[]);

  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      window.addEventListener('beforeunload', warnBeforeUserLeavesSite);
      return () => window.removeEventListener('beforeunload', warnBeforeUserLeavesSite);
    }
  }, []);

  const savePendingOrderToFirebase = useCallback(() => {
    setError(null);
    setProcessingMessage('Saving registration...');
    setProcessing(true);

    // fire and forget - save bkup in case user closes browser halfway thru payment processing
    savePendingOrder(order);

    setProcessingMessage('Processing payment...');
	} , [order, setError, setProcessing, setProcessingMessage]);

  const saveFinalOrderToFirebase = useCallback(async () => {
    setProcessingMessage(order.paymentId === 'check' ? 'Updating registration...' : 'Payment successful. Updating registration...');
    try {
      await saveFinalOrder(order);
    } catch (err) {
      console.error(`error updating firebase record`, err);
      setError(`Your payment was processed successfully. However, we encountered an error updating your registration. Please contact ${EMAIL_CONTACT}.`);
      setPaying(false);
      setProcessing(false);
      return false;
    }
    setPaying(false);
    setProcessing(false);
    setCurrentPage('confirmation');
  }, [order, setError, setProcessing, setProcessingMessage, setPaying, setCurrentPage]);

  useEffect(() => {
    if (order.paymentId) {
      order.paymentId === 'PENDING' ? savePendingOrderToFirebase() : saveFinalOrderToFirebase();
    }
  }, [order, savePendingOrderToFirebase, saveFinalOrderToFirebase]);

  const admissionsTotal = order.people.reduce((total, person) => total + person.admissionCost, 0);
  const total = admissionsTotal + order.donation;
  // console.log('typeof admissionsTotal', typeof admissionsTotal);

  const handleClickBackButton = () => {
    setError(null);
    setCurrentPage(NUM_PAGES);
  }

  const prepOrderForFirebase = () => {
    const initialOrder = {
      ...order,
      people: order.people.map(updateApartment),
      paymentMethod,
      paymentId: 'PENDING',
      idempotencyKey: order.idempotencyKey || crypto.randomUUID()
    };
    const receipt = renderToStaticMarkup(<Receipt order={initialOrder} currentPage='confirmation' checkPayment={paymentMethod === 'check'} />);
    const additionalPersonReceipt = renderToStaticMarkup(<AdditionalPersonReceipt order={initialOrder} checkPayment={paymentMethod === 'check'} />);
    setOrder({ ...initialOrder, receipt, additionalPersonReceipt });
  };

  return (
    <section>
      <StyledPaper align='center'>

        {processing && <Loading processing={true} text={processingMessage} />}

        {!processing &&
          <Title>Amount due: ${total}</Title>
        }

        {paymentMethod === 'stripe' &&
          <StripeCheckoutWrapper
            total={total}
            name={fullName(order.people[0])}
            email={order.people[0].email}
            setError={setError}
            processing={processing} setProcessing={setProcessing}
            prepOrderForFirebase={prepOrderForFirebase}
          />
        }

        {paymentMethod === 'paypal' &&
          <PaypalCheckoutButton 
            paypalButtonsLoaded={paypalButtonsLoaded} setPaypalButtonsLoaded={setPaypalButtonsLoaded}
            total={total} 
            setError={setError} 
            setPaying={setPaying} 
            processing={processing}
            prepOrderForFirebase={prepOrderForFirebase}
          />
        }

        {paymentMethod === 'check' && 
          <>
            <Check 
              processing={processing}
              prepOrderForFirebase={prepOrderForFirebase}
            />
          </>
        }

        {!paying && !processing && (paymentMethod === 'check' || paymentMethod === 'stripe' || paypalButtonsLoaded) &&
          <TogglePaymentMode paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setError={setError} />
        }
      </StyledPaper>

      {!paying && !processing &&
        <>
          <Hidden smDown>
            <StyledPaper>
              <ButtonRow backButtonProps = {{ onClick: handleClickBackButton, text: 'Back' }} />
            </StyledPaper>
          </Hidden>

          <Hidden smUp>
            <MyMobileStepper currentPage={'checkout'} onClickBack={handleClickBackButton} />
          </Hidden>
        </>
      }
    </section>
  );
}

function updateApartment(person) {
  return (person.apartment && /^\d/.test(person.apartment)) ? { ...person, apartment: `#${person.apartment}` } : person;
}

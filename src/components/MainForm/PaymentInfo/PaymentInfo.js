import { useState, useEffect } from 'react';
import { useOrder } from 'components/OrderContext';
import { scrollToTop, clamp } from 'utils';
import { RightAlignedInput } from '../Input';
import { StyledPaper, Title, Paragraph } from 'components/Layout/SharedStyles';
import { InputAdornment, Box, Tab, Tabs } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import { useFormikContext } from 'formik';
import { PaymentExplanation } from 'components/Static/PaymentExplanation';
import config from 'config';
const { DEPOSIT_OPTION, DEPOSIT_COST, ADMISSION_COST_RANGE, DONATION_OPTION, DONATION_MAX, PAYMENT_DUE_DATE } = config;

export default function PaymentInfo() {
  const { order } = useOrder();
  const priceRange = [ADMISSION_COST_RANGE[0], ADMISSION_COST_RANGE[1]];
  const isSlidingScale = priceRange[0] < priceRange[1];
  const isMultiplePeople = order.people.length > 1;
  const [payingMax, setPayingMax] = useState(order.people[0].admission === ADMISSION_COST_RANGE[1]);
  const { values, setFieldValue, handleBlur } = useFormikContext();
  const [donate, setDonate] = useState(values.donation > 0);
  const [paymentTab, setPaymentTab] = useState(order.deposit > 0 ? 'deposit' : 'fullpayment');

  const handlePaymentTab = (_, newTab) => {
    setFieldValue('deposit', newTab === 'deposit' ? order.people.length * DEPOSIT_COST : 0);
    setPaymentTab(newTab);
  };

  useEffect(() => { scrollToTop(); },[])

  function clampValue({ event, range }) {
    const [field, value] = [event.target.name, parseInt(event.target.value) || range[0]];
    const clampedValue = clamp(value, range);
    setFieldValue(field, clampedValue);
    handleBlur(event); // bubble up to formik
  };

  function updateAdmissionCostValue(event) {
    clampValue({ event: event, range: priceRange})
    setPayingMax(clamp(values['people'][0]['admission'], priceRange) === ADMISSION_COST_RANGE[1] ? true : false)
    handleBlur(event); // bubble up to formik
  }

  const setAdmissionCostContent = (
    <>
      <Title>Admission cost</Title>
      <Paragraph>
        Number of admissions: {order.people.length}<br />
        Price per admission: ${ADMISSION_COST_RANGE[0]}
      </Paragraph>
      <Paragraph>
        Admissions total: ${order.people.length * ADMISSION_COST_RANGE[0]}
      </Paragraph>
    </>
  );

  const slidingScaleContent = (
    <>
      {isMultiplePeople && <Paragraph>How much is each person able to pay?</Paragraph>}
      {order.people.map((person, index) =>
        <RightAlignedInput
          key={index}
          sx={{ width: '5em', mb: 1 }}
          label={isMultiplePeople ? `${person.first} ${person.last}` : 'How much are you able to pay?'}
          name={`people[${index}].admission`}
          type='pattern'
          pattern='###'
          range={priceRange}
          onBlur={(event) => updateAdmissionCostValue(event)}
          InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
        />
      )}
    </>
  );

  return (
    <section className='PaymentInfo'>

      <PaymentExplanation />

      <div className='admissions-section'>
        <StyledPaper className='admissions-cost'>

          <Title>Sliding scale</Title>
          <Paragraph>Please read the sliding scale explanation above.</Paragraph>

          {DEPOSIT_OPTION &&
            <TabContext value={paymentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={paymentTab} onChange={handlePaymentTab} aria-label="payment options tabs">
                  <Tab label="Full Payment" value="fullpayment" sx={{ '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' } }} />
                  <Tab label="Deposit" value="deposit" sx={{ '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' } }} />
                </Tabs>
              </Box>
              <TabPanel value="fullpayment" sx={{ pl: 1, pr: 0 }}>
                {isSlidingScale ? slidingScaleContent : setAdmissionCostContent}
              </TabPanel>
              <TabPanel value="deposit" sx={{ pl: 1, pr: 0 }}>
                <Paragraph>A deposit of ${DEPOSIT_COST} per person is required to reserve your spot.</Paragraph>
                <Paragraph color='warning.main' sx={{ my: 2, fontWeight: 'bold' }}>The balance of the payment will be due by {PAYMENT_DUE_DATE}.</Paragraph>
              </TabPanel>
            </TabContext>
          }

          {!DEPOSIT_OPTION &&
          <>
            {isSlidingScale ? slidingScaleContent : setAdmissionCostContent}
          </>
          }

        </StyledPaper>

        {DONATION_OPTION && (payingMax || values['donation'] > 0) &&
          <StyledPaper className='donation-section'>
            <Title>Additional contribution</Title>
            {!donate && 
              <RightAlignedInput
                type='button'
                label="Would you like to make an additional contribution?"
                name="donate"
                buttonText="Yes"
                onClick={() => setDonate(true)}
              />
            }

            {donate && 
              <RightAlignedInput
                sx={{ minWidth: '6rem', maxWidth: '6rem' }}
                label="How much would you like to add as an additional contribution?"
                name="donation" 
                type='pattern'
                pattern='###'
                range={[0, DONATION_MAX]}
                onBlur={(event) => clampValue({ event: event, range: [0, DONATION_MAX]})}
                InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                autoFocus={values['donation'] === 0}
                // onFocus={(e) => e.target.select()}
              />
            }
          </StyledPaper>
        }
      </div>
    </section>
  );
}

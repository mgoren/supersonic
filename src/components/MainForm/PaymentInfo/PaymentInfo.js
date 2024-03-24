import { useState, useEffect } from 'react';
import { useOrder } from 'components/OrderContext';
import { scrollToTop, clamp } from 'utils';
import { RightAlignedInput } from '../Input';
import { StyledPaper, Title, Paragraph } from 'components/Layout/SharedStyles';
import { InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
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

  function handleDepositToggle(event) {
    setFieldValue('deposit', event.target.checked ? order.people.length * DEPOSIT_COST : 0);
  }

  return (
    <section className='PaymentInfo'>

      <PaymentExplanation />

      <div className='admissions-section'>
        <StyledPaper className='admissions-cost'>

          {!isSlidingScale &&
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
          }

          {isSlidingScale &&
            <>
              <Title>Sliding scale</Title>
              <Paragraph>Please read the sliding scale and deposit explanations above.</Paragraph>
              {isMultiplePeople && <Paragraph>How much is each person able to pay?</Paragraph>}
              {order.people.map((person, index) =>
                <RightAlignedInput
                  key={index}
                  sx={{ width: '5em', mb: 1 }}
                  label={isMultiplePeople ? `${person.first} ${person.last}` : 'How much are you able to pay?'}
                  name={`people[${index}].admission`}
                  pattern='###'
                  range={priceRange}
                  onBlur={(event) => updateAdmissionCostValue(event)}
                  InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                />
              )}
            </>
          }

          {DEPOSIT_OPTION &&
            <>
              <FormControlLabel
                label={<>Check here to pay a ${DEPOSIT_COST * order.people.length} deposit now and the rest later.</>}
                control={
                  <Checkbox
                    name='deposit-toggle'
                    color='secondary'
                    checked={values.deposit > 0}
                    onChange={(e) => handleDepositToggle(e)}
                  />
                }
              />
              {values.deposit > 0 &&
                <Paragraph sx={{ my: 2, color: 'orange', fontWeight: 'bold' }}>The balance of the payment will be due by {PAYMENT_DUE_DATE}.</Paragraph>
              }
            </>
          }

        </StyledPaper>

        {DONATION_OPTION && (payingMax || values['donation'] > 0) &&
          <StyledPaper className='donation-section'>
            <Title>Additional contribution</Title>
            {!donate && 
              <RightAlignedInput
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

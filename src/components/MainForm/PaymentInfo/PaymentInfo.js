import { useState, useEffect } from 'react';
import { useOrder } from 'components/OrderContext';
import { scrollToTop, clamp } from 'utils';
import { RightAlignedInput } from '../Input';
import { StyledPaper, Title, Paragraph } from 'components/Layout/SharedStyles';
import { InputAdornment, Typography, Link } from '@mui/material';
import { useFormikContext } from 'formik';
import { PaymentExplanation } from 'components/Static/PaymentExplanation';
import config from 'config';
const { DEPOSIT_MIN, ADMISSION_COST_RANGE, DONATION_OPTION, DONATION_RANGE, PAYMENT_DUE_DATE } = config;

export default function PaymentInfo({ donate, setDonate }) {
  const { order } = useOrder();
  const admissionsTotal = order.people.reduce((total, person) => total + person.admissionCost, 0);
  // console.log('admissionsTotal', typeof admissionsTotal)
  const priceRange = [DEPOSIT_MIN, ADMISSION_COST_RANGE[1]];
  const [splitPayment, setSplitPayment] = useState(order.people.some(person => person.admissionCost * order.people.length !== admissionsTotal));
  const [payingDeposit, setPayingDeposit] = useState(order.people.some(person => person.admissionCost < ADMISSION_COST_RANGE[0]));
  const [payingMax, setPayingMax] = useState(order.people[0].admissionCost === ADMISSION_COST_RANGE[1]);
  const { values, setFieldValue, handleBlur } = useFormikContext();

  useEffect(() => { scrollToTop(); },[])

  function showSplitPayments(e) {
    e.preventDefault();
    setSplitPayment(true);
  }

  function clampValue({ event, range }) {
    const [field, value] = [event.target.name, parseInt(event.target.value) || range[0]];
    const clampedValue = clamp(value, range);
    setFieldValue(field, clampedValue);
    handleBlur(event); // bubble up to formik
  };

  function updateAdmissionCostValue(event) {
    clampValue({ event: event, range: priceRange})
    setPayingDeposit(values['people'].some(person => clamp(person.admissionCost, priceRange) < ADMISSION_COST_RANGE[0]) ? true : false)
    setPayingMax(clamp(values['people'][0]['admissionCost'], priceRange) === ADMISSION_COST_RANGE[1] ? true : false)
    handleBlur(event); // bubble up to formik
  }

  function updateAdmissionCostValues(event) {
    const value = parseInt(event.target.value) || priceRange[0];
    const clampedValue = clamp(value, priceRange);
    order.people.forEach((_, index) => {
      setFieldValue(`people[${index}].admissionCost`, clampedValue);
    });
    setPayingDeposit(clampedValue < ADMISSION_COST_RANGE[0] ? true : false);
    setPayingMax(clampedValue === ADMISSION_COST_RANGE[1] ? true : false)
    handleBlur(event); // bubble up to formik
  }

  return (
    <section className='PaymentInfo'>

      <PaymentExplanation />

      <div className='admissions-section'>
        <StyledPaper className='admissions-cost'>

        {DEPOSIT_MIN === ADMISSION_COST_RANGE[1] &&
              <>
              <Title>Admission cost</Title>
                <p>
                  Number of admissions: {order.people.length}<br />
                  Price per admission: ${ADMISSION_COST_RANGE[0]}
                </p>
                <p>
                  Admissions total: ${order.people.length * ADMISSION_COST_RANGE[0]}
                </p>
              </>
            }

            { DEPOSIT_MIN < ADMISSION_COST_RANGE[1] &&
              <>
                <Title>Sliding scale</Title>
                {/* {DEPOSIT_MIN < ADMISSION_COST_RANGE[0] &&
                  <Paragraph>Deposit minimum: ${DEPOSIT_MIN}</Paragraph>
                } */}

                {splitPayment ?
                  <>
                    <Paragraph>Specify the amount each person will pay:</Paragraph>
                    {/* <SlidingScaleSummaryExplanation /> */}
                    {order.people.map((person, index) =>
                      <RightAlignedInput
                        key={index}
                        sx={{ width: '5em', mb: 1 }}
                        label={`${person.first} ${person.last}`}
                        name={`people[${index}].admissionCost`}
                        pattern='###'
                        range={priceRange}
                        onBlur={(event) => updateAdmissionCostValue(event)}
                        InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                      />
                    )}
                  </>
                  :
                  <>
                    <RightAlignedInput
                      sx={{ width: '5em' }}
                      // label={`How much are you able to pay${order.people.length > 1 ? ' *per person*' : ''}? ($${ADMISSION_COST_RANGE[0]}-${ADMISSION_COST_RANGE[1]})`}
                      label={`How much are you able to pay${order.people.length > 1 ? ' *per person*' : ''}?`}
                      name='people[0].admissionCost'
                      pattern='###'
                      range={priceRange}
                      onBlur={(event) => updateAdmissionCostValues(event)}
                      InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                    />
                    (Please read the sliding scale and deposit explanations above.)
                    {/* <SlidingScaleSummaryExplanation /> */}
                  </>
                }

                {!splitPayment && order.people.length > 1 &&
                  <Typography variant="body2" sx={{ mt: 2 }}>(or click <Link component='span' sx={{cursor: 'pointer'}} onClick={showSplitPayments}>here</Link> to specify different amounts per person)</Typography>
                }

                {payingDeposit &&
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
                range={DONATION_RANGE}
                onBlur={(event) => clampValue({ event: event, range: DONATION_RANGE})}
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

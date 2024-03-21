import { useState, useEffect } from 'react';
import { useOrder } from 'components/OrderContext';
import { scrollToTop, clamp } from 'utils';
import { RightAlignedInput } from '../Input';
import { StyledPaper, Title, Paragraph } from 'components/Layout/SharedStyles';
import { InputAdornment, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContext } from 'formik';
import { PaymentExplanation } from 'components/Static/PaymentExplanation';
import config from 'config';
const { DEPOSIT_OPTION, DEPOSIT_COST, ADMISSION_COST_RANGE, DONATION_OPTION, DONATION_RANGE, PAYMENT_DUE_DATE } = config;

export default function PaymentInfo() {
  const { order, updateOrder } = useOrder();
  // const admissionsTotal = order.people.reduce((total, person) => total + person.admissionCost, 0);
  const isSlidingScale = ADMISSION_COST_RANGE[0] < ADMISSION_COST_RANGE[1];
  const priceRange = [ADMISSION_COST_RANGE[0], ADMISSION_COST_RANGE[1]];
  // const [splitPayment, setSplitPayment] = useState(order.people.some(person => person.admissionCost * order.people.length !== admissionsTotal));
  const [splitPayment, setSplitPayment] = useState(true);
  const [payingMax, setPayingMax] = useState(order.people[0].admissionCost === ADMISSION_COST_RANGE[1]);
  const { values, setFieldValue, handleBlur, handleChange } = useFormikContext();
  const [donate, setDonate] = useState(values.donation > 0);

  // const admissionCostLabel = <>How much are you able to pay{order.people.length > 1 && <em><strong> per person</strong></em>}? (${ADMISSION_COST_RANGE[0]}-{ADMISSION_COST_RANGE[1]})</>;
  const admissionCostLabel = <>How much are you able to pay{order.people.length > 1 && <em><strong> per person</strong></em>}?</>;

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
    setPayingMax(clamp(values['people'][0]['admissionCost'], priceRange) === ADMISSION_COST_RANGE[1] ? true : false)
    handleBlur(event); // bubble up to formik
  }

  function updateAdmissionCostValues(event) {
    const value = parseInt(event.target.value) || priceRange[0];
    const clampedValue = clamp(value, priceRange);
    order.people.forEach((_, index) => {
      setFieldValue(`people[${index}].admissionCost`, clampedValue);
    });
    setPayingMax(clampedValue === ADMISSION_COST_RANGE[1] ? true : false)
    handleBlur(event); // bubble up to formik
  }

  function handleDepositToggle(e) {
    updateOrder({ deposit: e.target.checked });
    handleChange(e); // bubble up to formik
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
              <Typography>Please read the sliding scale and deposit explanations above.</Typography>

              {splitPayment &&
                <>
                  <Paragraph>Specify the amount each person will pay:</Paragraph>
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
              }

              {!splitPayment &&
                <>
                  <RightAlignedInput
                    sx={{ width: '5em' }}
                    label={admissionCostLabel}
                    name='people[0].admissionCost'
                    pattern='###'
                    range={priceRange}
                    onBlur={(event) => updateAdmissionCostValues(event)}
                    InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                  />
                  {order.people.length > 1 &&
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      (or click <Link component='span' sx={{cursor: 'pointer'}} onClick={showSplitPayments}>here</Link> to specify different amounts per person)
                    </Typography>
                  }
                </>
              }

            </>
          }

          {DEPOSIT_OPTION &&
            <>
              <FormControlLabel
                label={<>Click here to pay a ${DEPOSIT_COST * order.people.length} deposit now and the rest later.</>}
                control={
                  <Checkbox
                    name='deposit'
                    color='secondary'
                    checked={order.deposit}
                    onChange={(e) => handleDepositToggle(e)}
                  />
                }
              />
              {order.deposit &&
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

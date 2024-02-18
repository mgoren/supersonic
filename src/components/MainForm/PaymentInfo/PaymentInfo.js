import { useState, useEffect } from 'react';
import { scrollToTop, clamp } from 'utils';
import { RightAlignedInput } from '../Input';
import { StyledPaper, Title, Paragraph } from 'components/Layout/SharedStyles';
import { InputAdornment, Typography, Link } from '@mui/material';
import { useFormikContext } from 'formik';
// import PaymentExplanation from 'components/static/PaymentExplanation';
import config from 'config';
const { DEPOSIT_MIN, ADMISSION_COST_RANGE, DONATION_OPTION, DONATION_RANGE } = config;

export default function PaymentInfo({ order, donate, setDonate, clampValue }) {
  const admissionsTotal = order.people.reduce((total, person) => total + parseInt(person.admissionCost), 0);
  const priceRange = [DEPOSIT_MIN, ADMISSION_COST_RANGE[1]];
  const [splitPayment, setSplitPayment] = useState(order.people.some(person => parseInt(person.admissionCost) * order.people.length !== admissionsTotal));
  const { values, setFieldValue, handleBlur } = useFormikContext();

  // console.log('PaymentInfo admissionCost type', typeof order.people[0].admissionCost);

  useEffect(() => { scrollToTop(); },[])

  function showSplitPayments(e) {
    e.preventDefault();
    setSplitPayment(true);
  }

  function updateAdmissionCostValues(event) {
    const clampedValue = clamp(
      parseInt(event.target.value) || DEPOSIT_MIN,
      priceRange
    );
    order.people.forEach((_, index) => {
      setFieldValue(`people[${index}].admissionCost`, clampedValue);
    });
    handleBlur(event); // bubble up to formik
  }

  return (
    <section className='PaymentInfo'>

      {/* <PaymentExplanation /> */}

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
                {DEPOSIT_MIN < ADMISSION_COST_RANGE[0] &&
                  <Paragraph>Deposit minimum: ${DEPOSIT_MIN}</Paragraph>
                }

                {splitPayment ?
                  <>
                    <Paragraph>Specify the amount each person will pay:</Paragraph>
                    <Typography>$100 (standard fee)</Typography>
                    <Typography>$120 (a nice donation)</Typography>
                    <Typography>$150 (a generous donation)</Typography>

                    {order.people.map((person, index) =>
                      <RightAlignedInput
                        key={index}
                        sx={{ width: '5em', mb: 1 }}
                        label={`${person.first} ${person.last}`}
                        name={`people[${index}].admissionCost`}
                        pattern='###'
                        range={priceRange}
                        onBlur={(event) => clampValue({ event: event, range: priceRange})}
                        InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                      />
                    )}
                  </>
                  :
                  <>
                    <RightAlignedInput
                      sx={{ width: '5em' }}
                      label={`How much are you able to pay${order.people.length > 1 ? ' *per person*' : ''}? ($${ADMISSION_COST_RANGE[0]}-${ADMISSION_COST_RANGE[1]})`}
                      name='people[0].admissionCost'
                      pattern='###'
                      range={priceRange}
                      onBlur={(event) => updateAdmissionCostValues(event)}
                      InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
                    />
                    <Typography>$100 (standard fee)</Typography>
                    <Typography>$120 (nice)</Typography>
                    <Typography>$150 (real nice)</Typography>
                  </>
                }

                {!splitPayment && order.people.length > 1 &&
                  <Typography variant="body2" sx={{ mt: 2 }}>(or click <Link component='span' sx={{cursor: 'pointer'}} onClick={showSplitPayments}>here</Link> to specify different amounts per person)</Typography>
                }
              </>
            }

        </StyledPaper>

        {DONATION_OPTION &&
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

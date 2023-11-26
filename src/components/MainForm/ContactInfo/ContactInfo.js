import { useEffect } from 'react';
import { scrollToTop } from 'utils';
import ContactInfoInputs from '../ContactInfoInputs';
import { StyledPaper, Title } from 'components/Layout/SharedStyles';
import { RightAlignedInput } from '../Input';
import config from 'config';
const { ADMISSION_QUANTITY_RANGE, PERSON_INPUTS } = config;

export default function ContactInfo({ admissionQuantity, clampValue }) {
  useEffect(() => { scrollToTop(); },[])

  return (
    <section>
      <StyledPaper className='admissions-quantity'>
        <Title>Number of admissions</Title>
        <RightAlignedInput
          type='radio'
          name='admissionQuantity'
          label={'How many people are you registering?'}
          options={Array(ADMISSION_QUANTITY_RANGE[1])
            .fill()
            .map((_, index) => ({ label: index + 1, value: index + 1 }))
          }
        />
      </StyledPaper>

      <section className='contact-section'>
        {Array(admissionQuantity).fill().map((_, index) => {
          return (
            <StyledPaper key={index}>
              <Title>{PERSON_INPUTS[index].label}</Title>
              <ContactInfoInputs
                index={index}
                fields={PERSON_INPUTS[index].fields}
              />
            </StyledPaper>
          );
        })}
      </section>
    </section>
  );
}

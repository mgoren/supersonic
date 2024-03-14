import { useState } from 'react';
import { useOrder } from 'components/OrderContext';
import { Form, useFormikContext } from 'formik';
import { getFirstInvalidFieldName, sanitizeObject } from 'utils';
import countryMapping from 'countryMapping';
import People from '../People';
import PaymentInfo from '../PaymentInfo';
import NavButtons from 'components/NavButtons';
import config from 'config';
const { NUM_PAGES } = config;

export default function FormContents() {
  const { order, updateOrder, currentPage, setCurrentPage } = useOrder();
  const formik = useFormikContext();
  const { values } = formik;
  const [donate, setDonate] = useState(values.donation > 0);

  async function saveForm() {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(errors, true); // show errors
      // scroll to first invalid field; refactor to use ref instead of directly accessing DOM
      const firstInvalidFieldName = getFirstInvalidFieldName(errors);
      if (firstInvalidFieldName) {
        const invalidFieldElement = document.getElementsByName(firstInvalidFieldName)[0];
        if (invalidFieldElement) {
          invalidFieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    const submittedOrder = Object.assign({}, values);
    const sanitizedOrder = sanitizeObject(submittedOrder);
    const orderWithCountry = { ...sanitizedOrder, people: sanitizedOrder.people.map(updateCountry) };
    updateOrder(orderWithCountry);
    return true;
  }

  async function resetForm() {
    formik.resetForm({ values: order });
  }

  function handleClickBackButton() {
    updateOrder(values);
    formik.setSubmitting(false);
    setCurrentPage(currentPage - 1);
  }

  return(
    <Form spellCheck='false'>
      {currentPage === 1 &&
        <People
          resetForm={resetForm}
          saveForm={saveForm}
        />
      }
      {currentPage === 2 &&
        <PaymentInfo
          donate={donate} setDonate={setDonate}
        />
      }

      {currentPage > 1 && (
        <NavButtons
          backButtonProps = {{ text: 'Back', onClick: handleClickBackButton }}
          nextButtonProps = {{ text: currentPage === NUM_PAGES ? 'Checkout' : 'Next...'}}
        />
      )}
    </Form>
  );
}

function updateCountry(person) {
  if (person.country === 'United States') {
    return { ...person, country: 'USA' };
  } else if (person.state) {
    const region = person.state.toLowerCase().replace(/\s/g, '').trim();
    const country = countryMapping[region] || person.country;
    return { ...person, country };
  } else {
    return person;
  }
}

import { useEffect } from 'react';
import { useOrder } from 'components/OrderContext';
import { Formik } from 'formik';
import { sanitizeObject, warnBeforeUserLeavesSite } from 'utils';
import FormContents from "./FormContents";
import { validationSchema } from './validationSchema';
import countryMapping from 'countryMapping';
import config from 'config';
const { NUM_PAGES } = config;

export default function MainForm() {
  const { order, updateOrder, currentPage, setCurrentPage } = useOrder();

  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      window.addEventListener('beforeunload', warnBeforeUserLeavesSite);
      return () => window.removeEventListener('beforeunload', warnBeforeUserLeavesSite);
    }
  }, []);

  // it doesn't get here until all validations are passing
  function submitForm(values, actions) {
    const submittedOrder = Object.assign({}, values);
    const sanitizedOrder = sanitizeObject(submittedOrder);
    const orderWithCountry = { ...sanitizedOrder, people: sanitizedOrder.people.map(updateCountry) };
    if (currentPage === NUM_PAGES) {
      updateOrder({ ...orderWithCountry, status: 'checkout' });
    } else {
      updateOrder(orderWithCountry);
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <Formik
      initialValues={order}
      validationSchema={validationSchema({ currentPage })}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={ (values, actions) => {submitForm(values, actions);} }
    >
      <FormContents />
    </Formik>
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

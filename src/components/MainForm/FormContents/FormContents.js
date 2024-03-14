import { useState } from 'react';
import { useOrder } from 'components/OrderContext';
import { Form, useFormikContext } from 'formik';
import People from '../People';
import PaymentInfo from '../PaymentInfo';
import NavButtons from 'components/NavButtons';
import config from 'config';
const { NUM_PAGES } = config;

export default function FormContents() {
  const { updateOrder, currentPage, setCurrentPage } = useOrder();
  const formik = useFormikContext();
  const { values } = formik;
  const [donate, setDonate] = useState(values.donation > 0);

  function handleClickBackButton() {
    updateOrder(values);
    formik.setSubmitting(false);
    setCurrentPage(currentPage - 1);
  }

  return(
    <Form spellCheck='false'>
      {currentPage === 1 &&
        <People />
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

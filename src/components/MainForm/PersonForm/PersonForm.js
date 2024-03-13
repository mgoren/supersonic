import { useOrder } from 'components/OrderContext';
import { useFormikContext } from 'formik';
import { Box, Button } from '@mui/material';
import ContactInfo from '../ContactInfo';
import MiscInfo from '../MiscInfo';

export default function PersonForm({ editIndex, setEditIndex, saveForm, resetForm, isNewPerson, setIsNewPerson }) {
  const { order } = useOrder();
  const formik = useFormikContext();
  const { values, setFieldValue } = formik;

  function handleCancelButton() {
    setEditIndex(null);
    resetForm();
    if (isNewPerson) {
      const people = values.people.slice(0, -1);
      setFieldValue('people', people);
      setIsNewPerson(false);
    }
  }

  async function handleSaveButton() {
    const success = await saveForm();
    if (success) {
      setEditIndex(null);
      setIsNewPerson(false);
    }
  }

  return (
    <>
      <ContactInfo index={editIndex} />
      <MiscInfo index={editIndex} />
      <Box sx={{ mt: 5, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          { order.people[0].email !== '' ?
            <>
              <div />
              <Button onClick={handleCancelButton} variant='contained' color='warning'>Cancel</Button>
              <div />
              <Button onClick={handleSaveButton} variant='contained' color='success'>Save</Button>
              <div />
            </>
            :
            <>
              <div />
              <Button onClick={handleSaveButton} variant='contained' color='success'>Save</Button>
              <div />
            </>
          }
        </Box>
      </Box>
    </>
  );
}

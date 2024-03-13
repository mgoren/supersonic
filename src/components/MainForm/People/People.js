import { useState } from 'react';
import { useOrder } from 'components/OrderContext';
import { useFormikContext } from 'formik';
import { Box, Button } from '@mui/material';
import PersonForm from '../PersonForm';
import NavButtons from 'components/NavButtons';
import { StyledPaper } from 'components/Layout/SharedStyles';
import config from 'config';
import { PersonContainerAccordion } from 'components/OrderSummary';
const { ADMISSION_QUANTITY_MAX, PERSON_DEFAULTS } = config;

export default function People({ resetForm, saveForm }) {
  const { order, updateOrder } = useOrder();
  const [editIndex, setEditIndex] = useState(order.people[0].email === '' ? 0 : null);
  const [isNewPerson, setIsNewPerson] = useState(false);

  const formik = useFormikContext();
  const { values, setFieldValue } = formik;

  const handleAddNew = () => {
    const people = [...values.people, PERSON_DEFAULTS];
    setEditIndex(order.people.length);
    setFieldValue('people', people); // update formik field array
    setIsNewPerson(true);
  };

  const handleEdit = (personIndex) => {
    setEditIndex(personIndex);
  };

  const handleDelete = (personIndex) => {
    const person = order.people[personIndex];
    if (window.confirm(`Remove ${person.first} ${person.last} from registration?`)) {
      let people = order.people.filter((_, index) => index !== personIndex);
      if (people.length === 0) {
        people.push(PERSON_DEFAULTS);
        setEditIndex(0);
        resetForm();
      }
      updateOrder({ people });
      setFieldValue('people', people); // update formik field array
    }
  };

  return (
    <>
      {(order.people.length > 1 || order.people[0].email || editIndex === null) &&
        <StyledPaper>
          {order.people.map((person, index) => (
            <Box key={index}>
              {index !== editIndex && person.email && 
                <PersonContainerAccordion
                  person={person}
                  personIndex={index}
                  showButtons={editIndex === null}
                  setEditIndex={setEditIndex} 
                  handleEdit={handleEdit} handleDelete={handleDelete}
                />
              }
            </Box>
          ))}

          { editIndex === null && order.people.length < ADMISSION_QUANTITY_MAX &&
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <div />
              <Button onClick={handleAddNew} variant='text' color='warning'>Add another person</Button>
              <div />
            </Box>
          }
        </StyledPaper>
      }

      {editIndex !== null &&
        <>
          <StyledPaper>
            <PersonForm
              editIndex={editIndex} setEditIndex={setEditIndex}
              resetForm={resetForm}
              saveForm={saveForm}
              isNewPerson={isNewPerson} setIsNewPerson={setIsNewPerson}
            />
          </StyledPaper>
        </>
      }

      {editIndex === null &&
        <NavButtons nextButtonProps = {{ text: 'Next' }} />
      }
    </>
  );
}

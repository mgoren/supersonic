// NOTE: this component uses some vanilla html becuase it's used in the confirmation email

import { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ButtonRow from 'components/ButtonRow';
import config from 'config';
const { SCHOLARSHIP_OPTIONS } = config;

export default function OrderSummary({ order, currentPage }) {
  const admissions = order.people.map(person => parseInt(person.admissionCost));
  const admissionsTotal = admissions.reduce((total, admission) => total + admission, 0);
  // console.log('typoeof admissionsTotal', typeof admissionsTotal);
  const total = admissionsTotal + order.donation;
  const splitPayment = order.people.some(person => parseInt(person.admissionCost) * order.people.length !== admissionsTotal);

  return (
    <>
      <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
        {order.people.length > 1 ? 'Admissions' : 'Your info'}
      </Typography>

      {order.people.map((person, index) => (
        <Box key={index}>
          {person.email && <PersonContainerDotted person={person} />}
        </Box>
      ))}

      {isNaN(currentPage) &&
        <Box sx={{ mt: 5 }}>
          <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
            {currentPage === 'confirmation' && order.paymentId !== 'check' ? 'Amount paid' : 'Amount due'}
          </Typography>
          <p>
            {splitPayment ?
              <>
                Admissions:&nbsp;
                {admissions.map((cost, index) => (
                  <span key={index}>
                    ${cost} {index < admissions.length - 1 ? '+ ' : '= '}
                  </span>
                ))}
                ${admissionsTotal}
              </>
              :
              <>
                Admissions: {order.people.length} x ${order.people[0].admissionCost} = ${admissionsTotal}
              </>
            }

            {order.donation > 0 &&
              <>
                <br />
                Additional donation: ${order.donation}<br />
                Total: ${total}
              </>
            }
          </p>
        </Box>
      }
    </>
  );
}

function PersonContainerDotted({ person }) {
  return (
    <Box sx={{ border: 'dotted', p: 2, m: 2 }}>
      <Typography variant='body' sx={{ fontWeight: 'bold' }}>{person.first} {person.last}</Typography>
      <PersonSummary person={person} />
    </Box>
  );
}

export function PersonContainerAccordion({ order, personIndex, showButtons, handleEdit, handleDelete }) {
  const [expanded, setExpanded] = useState(false);
  const person = order.people[personIndex];

  return (
    <Accordion expanded={expanded} onChange={ () => setExpanded(!expanded) } sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>{person.first} {person.last}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <PersonSummary person={person} />
        {showButtons &&
          <ButtonRow
            deleteButtonProps={{ onClick: () => handleDelete(personIndex), text: 'Delete' }}
            editButtonProps={{ onClick: () => handleEdit(personIndex), text: 'Edit' }}
          />
        }
      </AccordionDetails>
    </Accordion>
  );
}

function PersonSummary({ person }) {
  return (
    <>
      <Box>
        <p>
          Nametag: {person.nametag ? <>{person.nametag}</> : <>{person.first}</>} {person.pronouns && <>({person.pronouns})</>}<br />
          {person.email && <>{person.email}<br /></>}
          {person.phone && <>{person.phone}<br /></>}
          {person.address && <>{displayAddress(person.address, person.apartment)}<br /></>}
          {person.city && <>{person.city}, {person.state} {person.zip}<br /></>}
          {person.country !== 'USA' && <>{person.country}</>}
        </p>
      </Box>
      <Box>
        <p>
          Include on roster: {!!person.share.length ? person.share.join(', ') : 'do not share'}<br />
          Include on carpool list: {!!person.carpool.length ? person.carpool.join(', ') : 'no'}<br />
          Volunteering: {!!person.volunteer.length ? person.volunteer.join(', ') : 'not signed up'}<br />
          Scholarship: {!!person.scholarship.length ? getCheckboxTitles({ property: person.scholarship, options: SCHOLARSHIP_OPTIONS }).join(', ').toLowerCase() : 'not requesting'}<br />
          {person.comments && <>Comments: {person.comments}<br /></>}
        </p>
      </Box>
    </>
  );
}


// helpers

function displayAddress(address, apartment) {
  const displayApartment = apartment?.length > 0 && isFinite(apartment.slice(0,1)) ? `#${apartment}` : apartment;
  return apartment ? `${address} ${displayApartment}` : address;
}

function getCheckboxTitles({ property, options }) {
  let checkboxTitles = property.map(property => {
    const checkboxOption = options.find(option => option.value === property);
    return checkboxOption ? checkboxOption.label : property;
  });
  checkboxTitles.sort((a, b) => {
    const aIndex = options.findIndex(option => option.label === a);
    const bIndex = options.findIndex(option => option.label === b);
    return aIndex - bIndex;
  });
  return checkboxTitles;
}

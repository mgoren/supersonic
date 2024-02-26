// NOTE: this component uses some vanilla html becuase it's used in the confirmation email

import { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ButtonRow from 'components/ButtonRow';
import config from 'config';
const { FIELD_CONFIG, ORDER_SUMMARY_OPTIONS } = config;

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
    <Box sx={{ mt: 2 }}>
      <Accordion expanded={expanded} onChange={ () => setExpanded(!expanded) }>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{person.first} {person.last}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PersonSummary person={person} />
          {showButtons &&
            <Box sx={{ my: 4 }}>
              <ButtonRow
                deleteButtonProps={{ onClick: () => handleDelete(personIndex), text: 'Delete' }}
                editButtonProps={{ onClick: () => handleEdit(personIndex), text: 'Edit' }}
              />
            </Box>
          }
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

function PersonSummary({ person }) {
  return (
    <>
        {ORDER_SUMMARY_OPTIONS
          .map((option) => {
            const { property, label, mapping, defaultValue } = option;
            return (
              <Box key={option.property}>
                {renderConditionalData({ person, property, label, mapping, defaultValue })}
              </Box>
            );
          })
        }
    </>
  );
}

// helpers

function renderConditionalData ({ person, property, label, mapping, defaultValue }) {
  const data = person[property];
  let content;
  if (property === 'address') {
    content = formatAddress(person);
  } else if (Array.isArray(data)) {
    content = formatArray(data, defaultValue, mapping);
  } else if (data) {
    content = formatSimpleDataTypes(data, defaultValue);
  } else {
    content = defaultValue;
  }
  return content ? <>{label && `${label}: `}{content}<br /></> : null;
}

function formatAddress(person) {
  const { address, apartment, city, state, zip, country } = person;
  if (!address && !city && !state && !zip) return null;
  let streetAddress;
  if (address) {
    const displayApartment = apartment?.length > 0 && isFinite(apartment.slice(0,1)) ? `#${apartment}` : apartment;
    streetAddress = apartment ? `${address} ${displayApartment}` : address;
  }
  const cityStateZip = city ? `${city}, ${state} ${zip}` : `${state} ${zip}`;
  const cityStateZipWithCountry = country === 'USA' ? cityStateZip : `${cityStateZip}, ${country}`;
  return <>{streetAddress && <>{streetAddress}<br /></>}{cityStateZipWithCountry}</>
}

function formatArray(data, defaultValue, mapping) {
  if (!data.length) return defaultValue;
  if (mapping) {
    const checkboxTitles = data
      .map(item => mapping.find(option => option.value === item)?.label || item)
      .sort((a, b) => {
        const aIndex = mapping.findIndex(option => option.label === a);
        const bIndex = mapping.findIndex(option => option.label === b);
        return aIndex - bIndex;
      });
    return checkboxTitles.join(', ');
  } else {
    return data.join(', ');
  }
}

function formatSimpleDataTypes(data, defaultValue) {
  const formattedData = String(data).trim();
  return formattedData || defaultValue;
}

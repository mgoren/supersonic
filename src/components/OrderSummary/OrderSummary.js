import { Box, Typography } from '@mui/material';
import config from 'config';
const { SCHOLARSHIP_OPTIONS } = config;

export default function OrderSummary({ order, currentPage }) {
  const total = order.admissionCost * order.admissionQuantity + order.donation;

  let scholarshipTitles = getCheckboxTitles({ property: order.scholarship, options: SCHOLARSHIP_OPTIONS });

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
          {order.admissionQuantity > 1 ? 'Admissions' : 'Contact info'}
        </Typography>
        {order.people.slice(0, order.admissionQuantity).map((person, index) => (
          <p key={index}>
            {person.first} {person.last}<br />
            Nametag: {person.nametag ? <>{person.nametag}</> : <>{person.first} {person.last}</>} {person.pronouns && <>({person.pronouns})</>}<br />
            {person.email && <>{person.email}<br /></>}
            {person.phone && <>{person.phone}<br /></>}
            {person.address && <>{displayAddress(person.address, person.apartment)}<br /></>}
            {person.city && <>{person.city}, {person.state} {person.zip}<br /></>}
            {person.country !== 'USA' && <>{person.country}</>}
          </p>
        ))}
      </Box>

      {(isNaN(currentPage) || currentPage > 2) &&
        <Box sx={{ mt: 5 }}>
          <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
            Miscellanea
          </Typography>
          <p>
            Include on roster: {!!order.share.length ? order.share.join(', ') : 'do not share'}<br />
            Include on carpool list: {!!order.carpool.length ? order.carpool.join(', ') : 'no'}<br />
            Volunteering: {!!order.volunteer.length ? order.volunteer.join(', ') : 'not signed up'}<br />
            Scholarship: {!!order.scholarship.length ? scholarshipTitles.join(', ').toLowerCase() : 'not requesting'}<br />
            {order.comments && <>Comments: {order.comments}<br /></>}
          </p>
        </Box>
      }

      {isNaN(currentPage) &&
        <Box sx={{ mt: 5 }}>
          <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
            {currentPage === 'confirmation' && order.paymentId !== 'check' ? 'Amount paid' : 'Amount due'}
          </Typography>
          <p>
            Admissions: {order.admissionQuantity} x ${order.admissionCost} = ${order.admissionQuantity * order.admissionCost}<br />
            {order.donation > 0 &&
              <>
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

import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { scrollToTop } from 'utils.js';
import { Input } from '../Input';
import { Title } from 'components/Layout/SharedStyles';
import { Box } from '@mui/material';
import config from 'config';
const { FIELD_CONFIG, PERSON_MISC_FIELDS } = config;
const SHARE_OPTIONS = FIELD_CONFIG['share'].options;

export default function MiscInfo({ index }) {
  const [shareOptions, setShareOptions] = useState(SHARE_OPTIONS);
  const formik = useFormikContext();
  const { values, setFieldValue, handleChange } = formik;

  useEffect(() => { scrollToTop(); },[])

  useEffect(() => {
    if (values.people[index].share) {
      const newShareOptions = values.people[index].share.includes('name') ? SHARE_OPTIONS : SHARE_OPTIONS.filter(option => option.value === 'name');
      setShareOptions(newShareOptions);
    }
  }, [values.people, index]);

  function updateShareCheckboxOptions(e) {
    const { value, checked } = e.target;
    if( value === 'name') {
      setFieldValue(`people[${index}].share`, checked ? [value] : []);
    } else {
      handleChange(e); // let formik handle it
    }
  }
  return (
    <Box className='MiscInfo' sx={{ mt: 4 }}>
      {PERSON_MISC_FIELDS
        .map(field => ({ field, ...FIELD_CONFIG[field] }))
        .map((input) => {
          const { field, type, title, label, options, ...props } = input;
          const updatedOptions = field === 'share' ? shareOptions : options;
          return (
            <Box sx={{ mb: 6 }} key={field}>
              <Title>{title}</Title>
              <Input
                type={type}
                label={label}
                name={`people[${index}].${field}`}
                field={field}
                index={index}
                options={type === 'checkbox' || type === 'radio' ? updatedOptions : undefined}
                onChange={field === 'share' ? updateShareCheckboxOptions : handleChange} // handleChange is formik handler
                {...props}
              />
            </Box>
          );
        })
      }
    </Box>
  );
}

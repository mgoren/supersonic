import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { scrollToTop } from 'utils.js';
import { Input, CheckboxInput, RadioButtons } from '../Input';
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

  function updateCheckboxOptions(e) {
    const { name, value, checked } = e.target;
    const field = name.split('.').pop();
    if( field === 'share'  && value === 'name') {
      setFieldValue(`people[${index}].share`, checked ? [value] : []);
    } else {
      handleChange(e); // let formik handle it
    }
  }
  return (
    <Box className='MiscInfo' sx={{ mt: 4 }}>
      {PERSON_MISC_FIELDS
        .map(field => ({ field, ...FIELD_CONFIG[field] }))
        .sort((a, b) => a.order - b.order)
        .map((input) => {
          const { field, type, title, label, options, ...props } = input;
          return (
            <Box sx={{ mb: 6 }} key={field}>
              <Title>{title}</Title>
              {type === 'checkbox' &&
                <CheckboxInput
                  label={label}
                  name={`people[${index}].${field}`}
                  options={field === 'share' ? shareOptions : options}
                  key={`${index}-${field}`}
                  onChange={(e) => updateCheckboxOptions(e)}
                />
              }
              {type === 'radio' &&
                <RadioButtons
                  label={label}
                  name={`people[${index}].${field}`}
                  options={options}
                  key={`${index}-${field}`}
                  field={field}
                  index={index}
                  {...props}
                />
              }
              {type === 'textarea' &&
                <Input
                  type='textarea'
                  name={`people[${index}].${field}`}
                  label={label}
                  key={`${index}-${field}`}
                />
              }
            </Box>
          );
        })
      }
    </Box>
  );
}

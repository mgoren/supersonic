import { useEffect } from 'react';
import { isMobile } from "react-device-detect";
import { Field, useFormikContext, getIn } from 'formik';
import { PatternFormat } from 'react-number-format';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import { usePlacesWidget } from "react-google-autocomplete";
import { useField } from 'formik';

export const Input = ({ pattern, buttonText, onClick, ...props }) => {
  if (buttonText) {
    return <ButtonInput buttonText={buttonText} onClick={onClick} {...props} />;
  } else if (props.type === 'radio') {
    return <RadioButtons {...props} />;
  } else if (pattern) {
    return <NumericInput pattern={pattern} {...props} />;
  } else if (props.type === 'textarea') {
    return <TextArea {...props} />;
  } else if (props.name.includes('address')) {
    return <AddressAutocompleteInput {...props} />;
  } else {
    return <TextInput {...props} />;
  }
};

export const RightAlignedInput = ({ label, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant='body1' sx={{ marginRight: '.5rem' }}>{label}</Typography>
      <Input {...props} />
    </Box>
  );
};

const ButtonInput = ({ buttonText, onClick, ...props }) => {
  return (
    <Button variant='contained' size='large' color='info' onClick={onClick}>
      <Typography variant='body1' sx={{ marginRight: '.5rem' }}>{buttonText}</Typography>
    </Button>
  );
};

const TextInput = ({ label, name, type, hidden, ...props }) => {
  const { touched, errors, values, setFieldValue, handleBlur } = useFormikContext();

  const handleBlurAndSetNametag = (e) => {
    handleBlur(e);  // bubble up to default Formik onBlur handler
    if (name.includes('first')) {
      const personIndex = name.split('[')[1].split(']')[0];
      const first = getIn(values, `people[${personIndex}].first`);
      const existingNametag = getIn(values, `people[${personIndex}].nametag`);
      if (first && !existingNametag) {
        setFieldValue(`people[${personIndex}].nametag`, first);
      }
    }
  };

  return (
    <Field name={name}>
      {({ field }) => {
        const fieldError = getIn(errors, name);
        const isTouched = getIn(touched, name);
        return (
          <Box >
            <TextField
              sx={{
                marginBottom: '.3rem',
                display: hidden ? 'none' : 'block',
                // '& .MuiFormHelperText-root': { fontSize: '.9rem' }
              }}
              type={type}
              label={label}
              variant='standard'
              error={Boolean(isTouched && fieldError)}
              helperText={isTouched && fieldError}
              {...field}
              onBlur={handleBlurAndSetNametag}
              {...props}
            />
          </Box>
        )
      }}
    </Field>
  );
};

const NumericInput = ({ variant, label, name, type, pattern, range, ...props }) => {
  const { touched, errors, setFieldValue } = useFormikContext();
  return (
    <Field name={name}>
      {({ field }) => {
        const fieldError = name.includes('phone') && getIn(errors, name);
        const isTouched = name.includes('phone') && getIn(touched, name);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PatternFormat
              type={isMobile ? 'tel' : 'text'}
              customInput={TextField}
              label={label}
              format={pattern}
              onValueChange={({value}) => setFieldValue(name, value)}
              inputMode='numeric'
              variant={variant || 'outlined'}
              error={Boolean(isTouched && fieldError)}
              helperText={isTouched && fieldError}
              {...field}
              {...props}
            />
          </Box>
        )
      }}
    </Field>
  );
};

export const CheckboxInput = ({ name, label, options, ...props }) => {
  return (
    <>
      {label && <Typography gutterBottom={true} htmlFor={name}>{label}</Typography>}
      {options.map(option => (
        <div key={option.value}>
          <Field name={name}>
            {({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    id={option.value}
                    checked={field.value.includes(option.value)}
                    {...field}
                    value={option.value}
                    color="secondary"
                  />
                }
                label={option.label}
              />
            )}
          </Field>
        </div>
      ))}
    </>
  );
};

export const TextArea = ({ label, name, ...props }) => {
  return (
    <>
      <Typography gutterBottom={true} sx={{ marginBottom: '1rem' }} htmlFor={name}>
        {label}
      </Typography>
      <Field
        as={TextField}
        name={name}
        multiline
        rows={5}
        sx={{ width: '100%' }}
      />
    </>
  );
};

export const RadioButtons = ({ name, label, options, ...props }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <RadioGroup
        row
        name={name}
        value={values[name]}
        onChange={ (e) => { setFieldValue(name, parseInt(e.currentTarget.value)) } }>

        {options.map((option) => (
          <FormControlLabel
            sx={{ mr: 1 }}
            key={option.value}
            label={option.label}
            value={option.value.toString()}
            labelPlacement="start"
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const AddressAutocompleteInput = ({ label, ...props }) => {
  const { setFieldValue, validateField } = useFormikContext();
  const [field, meta] = useField(props);
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
    onPlaceSelected: (place) => {
      if (!place?.address_components) return;

      // console.log('place', place)
      const addressComponents = place.address_components;
      // console.log(addressComponents);

      const fieldToComponentMapping = {
        address: ['street_number', 'route'],
        apartment: ['apartment', 'subpremise'],
        city: ['locality', 'sublocality_level_1'],
        state: ['administrative_area_level_1'],
        zip: ['postal_code'],
        country: ['country'],
      };

      const fieldValues = Object.keys(fieldToComponentMapping).reduce((acc, field) => {
        const values = fieldToComponentMapping[field].map(componentType => {
          const component = addressComponents.find(c => c.types.includes(componentType));
          return component?.long_name;
        });
        return {
          ...acc,
          [field]: values.join(' ').trim(),
        };
      }, {});

      // console.log(fieldValues);

      const personIndex = field.name.split('[')[1].split(']')[0];
      Object.keys(fieldValues).forEach(async(key) => {
        const fieldName = `people[${personIndex}][${key}]`;
        await setFieldValue(fieldName, fieldValues[key]);
        validateField(fieldName);
      });
    },
    options: {
      types: ['address'],
      fields: ['address_components'],
      componentRestrictions: { country: ['us', 'ca'] },
    },
  });

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Enter") e.preventDefault();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  return (
    <TextField
      label={label}
      {...field}
      {...props}
      inputRef={ref}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : ''}
    />
  );
};

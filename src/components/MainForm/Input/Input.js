import { useEffect } from 'react';
import { isMobile } from "react-device-detect";
import { Field, useFormikContext, getIn } from 'formik';
import { PatternFormat } from 'react-number-format';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, FormControl, RadioGroup, Radio, FormHelperText } from '@mui/material';
import { usePlacesWidget } from "react-google-autocomplete";
import { useField } from 'formik';
import config from 'config';
const { INCLUDE_LAST_ON_NAMETAG } = config;

export const Input = (props) => {
  const inputComponentMapping = {
    button: ButtonInput,
    checkbox: CheckboxInput,
    radio: RadioButtons,
    pattern: NumericInput,
    textarea: TextArea,
    address: AddressAutocompleteInput,
    email: TextInput,
    text: TextInput,
  };
  const { type = 'text' } = props;
  const Component = inputComponentMapping[type];
  return <Component {...props} />;
};

export const RightAlignedInput = ({ label, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant='body1' sx={{ mr: '.5rem' }}>{label}</Typography>
      <Input {...props} />
    </Box>
  );
};

const ButtonInput = ({ buttonText, onClick }) => {
  return (
    <Button variant='contained' size='large' color='info' onClick={onClick}>
      <Typography variant='body1' sx={{ mr: '.5rem' }}>{buttonText}</Typography>
    </Button>
  );
};

const TextInput = ({ label, name, type, hidden, ...props }) => {
  const { touched, errors, values, setFieldValue, handleBlur } = useFormikContext();
  const handleBlurAndSetNametag = (e) => {
    handleBlur(e);  // bubble up to default Formik onBlur handler
    const triggerField = INCLUDE_LAST_ON_NAMETAG ? 'last' : 'first';
    if (name.includes(triggerField)) {
      const personIndex = name.split('[')[1].split(']')[0];
      const existingNametag = getIn(values, `people[${personIndex}].nametag`);
      if (existingNametag) return;
      const first = getIn(values, `people[${personIndex}].first`);
      const last = getIn(values, `people[${personIndex}].last`);
      const fieldsFilled = INCLUDE_LAST_ON_NAMETAG ? first && last : first;
      const newNametag = INCLUDE_LAST_ON_NAMETAG ? `${first} ${last}` : first;
      if (fieldsFilled) {
        setFieldValue(`people[${personIndex}].nametag`, newNametag);
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
                mb: '.3rem',
                display: hidden ? 'none' : undefined,
                ...(props.width && { width: props.width })
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
        const isPhoneInput = name.includes('phone');
        const fieldError = isPhoneInput && getIn(errors, name);
        const isTouched = isPhoneInput && getIn(touched, name);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PatternFormat
              type={isMobile ? 'tel' : 'text'}
              customInput={TextField}
              label={label}
              format={pattern}
              onValueChange={({value}) => setFieldValue(name, isPhoneInput ? value : parseInt(value))}
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

const TextArea = ({ label, name, rows }) => {
  return (
    <>
      <Typography gutterBottom sx={{ mb: 2 }} htmlFor={name}>
        {label}
      </Typography>
      <Field
        as={TextField}
        name={name}
        multiline
        rows={rows}
        sx={{ width: '100%' }}
      />
    </>
  );
};

const CheckboxInput = ({ name, label, options, ...props }) => {
  return (
    <>
      {label && <Typography gutterBottom htmlFor={name}>{label}</Typography>}
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
                    {...props}
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

const RadioButtons = ({ name, label, options, field, index, required }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const fieldError = getIn(errors, name);
  const isTouched = getIn(touched, name);

  return (
    <FormControl error={Boolean(fieldError)}>
      {label && <Typography gutterBottom htmlFor={name}>
        {label}
        {required && <Typography component="span" color='error'> *</Typography>}
      </Typography>}
      <RadioGroup
        name={name}
        value={values.people[index][field]}
        onChange={ (e) => {
          setFieldValue(name, e.currentTarget.value, true);
        } }>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            label={option.label}
            value={option.value}
            labelPlacement="end"
            control={<Radio />}
          />
        ))}
      </RadioGroup>
      {isTouched && fieldError && <FormHelperText sx={{ mt: 2 }}>{fieldError}</FormHelperText>}
    </FormControl>
  );
};

const AddressAutocompleteInput = ({ label, ...props }) => {
  const { setFieldValue } = useFormikContext();
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

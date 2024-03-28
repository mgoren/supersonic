import { Input } from '../Input';
import { Grid } from '@mui/material';
import config from 'config';
import { useFormikContext } from 'formik';
const { FIELD_CONFIG } = config;

export default function ContactInfoInputs({ fields, index }) {
  const formik = useFormikContext();
  const { setFieldError } = formik;

  const clearErrorMessage = (field) => {
    setFieldError(`people[${index}].${field}`, '');
  }

  return (
    <Grid container spacing={2}>
      {fields.map((field) => (
        <Grid item xs={12} sm={FIELD_CONFIG[field].width} key={`${index}-${field}`}>
          <Input
            label={FIELD_CONFIG[field].label}
            name={`people[${index}].${field}`}
            type={FIELD_CONFIG[field].type || 'text'}
            pattern={FIELD_CONFIG[field].pattern}
            placeholder={FIELD_CONFIG[field].placeholder}
            autoComplete={FIELD_CONFIG[field].autoComplete}
            fullWidth
            mask='_'
            variant='standard'
            onFocus={() => clearErrorMessage(field)}
            hidden={FIELD_CONFIG[field].hidden}
          />
        </Grid>
      ))}
    </Grid>
  );
}

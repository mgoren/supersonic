import { FIELD_CONFIG } from './configFields';

const config = {
  ORDER_SUMMARY_OPTIONS: [
    { property: 'nametag', label: 'Name for roster' },
    { property: 'email', label: 'Email' },
    { property: 'phone', label: 'Phone' },
    { property: 'address', label: 'Address' },
    { property: 'housing', label: 'Housing' },
    { property: 'share', label: 'Include on roster', defaultValue: 'do not share' },
    { property: 'volunteer', label: 'Volunteering', mapping: FIELD_CONFIG['volunteer'].options },
    { property: 'comments', label: 'Comments' },
    // { property: 'admission', label: 'Admission Cost' },
  ]
}

export default config;

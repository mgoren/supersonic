import { FIELD_CONFIG } from './configFields';

const config = {
  ORDER_SUMMARY_OPTIONS: [
    { property: 'nametag', label: 'Name button' },
    { property: 'email', label: 'Email' },
    { property: 'phone', label: 'Phone' },
    { property: 'address', label: 'Address' },
    { property: 'hospitality', label: 'Housing', mapping: FIELD_CONFIG['hospitality'].options },
    { property: 'share', label: 'Include on roster', defaultValue: 'do not share' },
    // { property: 'volunteer', label: 'Volunteering', mapping: FIELD_CONFIG['volunteer'].options },
    { property: 'comments', label: 'Comments' },
    // { property: 'admission', label: 'Admission Cost' },
  ]
}

export default config;

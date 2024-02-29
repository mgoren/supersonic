import { FIELD_CONFIG } from './configFields';

export const ORDER_SUMMARY_OPTIONS = [
  { property: 'nametag', label: 'Name button' },
  { property: 'email', label: '' },
  { property: 'phone', label: '' },
  { property: 'address', label: '' },
  { property: 'share', label: 'Include on roster', defaultValue: 'do not share' },
  { property: 'carpool', label: 'Include on carpool list', defaultValue: 'no' },
  { property: 'volunteer', label: 'Volunteering', defaultValue: 'not signed up' },
  { property: 'scholarship', label: 'Scholarship', mapping: FIELD_CONFIG['scholarship'].options, defaultValue: 'not requesting' },
  { property: 'comments', label: 'Comments' },
  { property: 'admissionCost', label: 'Admission Cost' },
];

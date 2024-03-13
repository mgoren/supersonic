// *********************************************************************************************
// *** NOTE: if change form fields may also need to update OrderSummary and validationSchema ***
// *** ALSO: if add fields, be sure to add them to export at the end of this file            ***
// *********************************************************************************************

import { PAYPAL_OPTIONS } from './configPaypal';
import { FIELD_CONFIG, PERSON_INPUT_LABELS } from './configFields';
import { ORDER_SUMMARY_OPTIONS } from './configOrderSummary';
import { DANCES } from './configContent';
import { DEPOSIT_MIN, ADMISSION_COST_RANGE, ADMISSION_COST_DEFAULT, ADMISSION_QUANTITY_MAX, DONATION_OPTION, DONATION_RANGE, INCLUDE_PRONOUNS_ON_NAMETAG } from './configBasics';

// config for this particular registration instance; update this as needed!
const PERSON_CONTACT_FIELDS = ['first', 'last', 'nametag', 'pronouns', 'email', 'emailConfirmation', 'phone', 'address', 'apartment', 'city', 'state', 'zip', 'country'];
const PERSON_MISC_FIELDS = ['share', 'dietaryPreferences', 'dietaryRestrictions', 'carpool', 'volunteer', 'scholarship', 'comments'];
const PERSON_PAYMENT_FIELDS = ['admissionCost'];

const ORDER_MISC_DEFAULTS = {
  donation: DONATION_RANGE[0]
};

// don't change these
const PERSON_FIELDS = [...PERSON_CONTACT_FIELDS, ...PERSON_MISC_FIELDS, ...PERSON_PAYMENT_FIELDS];
const PERSON_DEFAULTS = PERSON_FIELDS.reduce((obj, field) => ({ ...obj, [field]: FIELD_CONFIG[field].defaultValue }), {});
const getOrderDefaults = () => ({
  ...ORDER_MISC_DEFAULTS,
  people: [PERSON_DEFAULTS],
  idempotencyKey: crypto.randomUUID()
});

// *********************************************************************************************
// ***                           Export fields here if added fields above!                   ***
// *********************************************************************************************
const config = {
  SANDBOX_MODE: true, // for testing only
  SHOW_PRE_REGISTRATION: false,
  NUM_PAGES: 2,
  STEPS: [
    {key: 1, label: 'Info'},
    {key: 2, label: 'Payment'},
    {key: 'checkout', label: 'Checkout'}
  ],
  PAYMENT_METHODS: ['stripe', 'check'], // options are 'stripe', 'paypal', and/or 'check' (first is default)
  EVENT_TITLE: 'Example Contra Weekend',
  EVENT_LOCATION: 'Someplace, Somewhere',
  EVENT_LOCATION_2: 'Some address',
  EVENT_DATE: 'Some dates',
  TITLE: 'Example Contra Weekend 2024 Registation',
  CONFIRMATION_PAYPAL_TITLE: 'Example Dance Weekend Confirmation',
  CONFIRMATION_CHECK_TITLE: 'Example Dance Weekend Registration',
  EMAIL_CONTACT: 'contact@example.com',
  COVID_POLICY_URL: 'example.com/covid',
  SAFETY_POLICY_URL: 'example.com/safety',
  CHECK_TO: 'Check To Example',
  CHECK_ADDRESS: <>Address line 1<br />Address line 2<br />Address line 3<br />Address line 4</>, // enclosed in <> </> to allow multiple lines
  DEPOSIT_MIN,
  PAYMENT_DUE_DATE: 'Example Payment Due Date',
  ADMISSION_COST_RANGE,
  ADMISSION_COST_DEFAULT,
  ADMISSION_QUANTITY_MAX,
  DONATION_OPTION,
  DONATION_RANGE,
  PAYPAL_OPTIONS,
  FIELD_CONFIG,
  PERSON_CONTACT_FIELDS,
  PERSON_FIELDS,
  PERSON_MISC_FIELDS,
  PERSON_DEFAULTS,
  PERSON_INPUT_LABELS,
  ORDER_SUMMARY_OPTIONS,
  DANCES,
  INCLUDE_PRONOUNS_ON_NAMETAG,
  getOrderDefaults
}

export default config;

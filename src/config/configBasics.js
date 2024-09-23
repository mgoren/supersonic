const config = {
  SANDBOX_MODE: true, // for testing only
  SHOW_PRE_REGISTRATION: false,
  ADMISSION_QUANTITY_MAX: 4,
  ADMISSION_COST_RANGE: [120, 999],
  ADMISSION_COST_DEFAULT: 180,
  DEPOSIT_OPTION: false,
  DEPOSIT_COST: 50,
  DONATION_OPTION: true,
  DONATION_MAX: 999,
  INCLUDE_PRONOUNS_ON_NAMETAG: true,
  INCLUDE_LAST_ON_NAMETAG: false,
  PAYMENT_METHODS: ['stripe', 'check'], // options are stripe|paypal|check (first is default)
  EVENT_TITLE: 'Supersonic Contra Dance',
  EVENT_LOCATION: 'Leif Erikson Hall',
  EVENT_LOCATION_2: 'Seattle',
  EVENT_DATE: '2025 February 7-9',
  TITLE: 'Supersonic 2025 Registation',
  CONFIRMATION_PAYPAL_TITLE: 'Supersonic Confirmation',
  CONFIRMATION_CHECK_TITLE: 'Supersonic Registration',
  EMAIL_CONTACT: 'info@supersoniccontra.com',
  TECHNICAL_CONTACT: 'contra@mortalwombat.net',
  COVID_POLICY_URL: 'www.supersoniccontra.com/about#wellness',
  // SAFETY_POLICY_URL: 'example.com/safety',
  DIRECT_PAYMENT_URL: 'buy.stripe.com/14kdR3dJheHw6fSbII',
  CHECK_TO: 'Supersonic Contra Dance Weekend',
  CHECK_ADDRESS: <>Karen Marshall<br />Supersonic Contra Dance Weekend<br />PO Box 1173<br />Anacortes, WA 98221</>,
  // PAYMENT_DUE_DATE: 'Example Payment Due Date',
  PERSON_INPUT_LABELS: [ 'Your contact information', 'Second admission', 'Third admission', 'Fourth admission' ],
  NUM_PAGES: 2,
  STEPS: [
    {key: 1, label: 'Info'},
    {key: 2, label: 'Payment'},
    {key: 'checkout', label: 'Checkout'}
  ],
};

export default config;

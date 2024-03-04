// field names must be in same order as spreadsheet columns
export const fieldOrder = [
  'key',
  'first',
  'last',
  'nametag',
  'pronouns',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'zip',
  'country',
  'volunteer',
  'scholarship',
  'share',
  'carpool',
  'comments',
  'admissionCost',
  'deposit',
  'donation',
  'total',
  'paid',
  'status',
  'purchaser',
  'createdAt',
  'paymentId'
];

export const validFields = [
  ...fieldOrder,
  'people',
  'paymentMethod',
  'receipt',
  'additionalPersonReceipt',
  'emailConfirmation',
  'idempotencyKey'
];

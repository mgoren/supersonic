// field names must be in same order as spreadsheet columns
export const fieldOrder = [
  'key',
  'first',
  'last',
  'pronouns',
  'nametag',
  'email',
  'phone',
  'city',
  'state',
  'hospitality',
  'share',
  'comments',
  'admission',
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

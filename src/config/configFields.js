import * as Yup from 'yup';
import { ADMISSION_COST_DEFAULT, ADMISSION_COST_RANGE } from './configBasics';

const NAME_REGEX = "^[^<>&@]+$";
const PRONOUNS_REGEX = "^[^<>&@]+$";
const PHONE_REGEX = "^[2-9][0-9-() ]*$";
export const NAME_VALIDATION = Yup.string().matches(NAME_REGEX, 'Invalid characters :(');
export const PRONOUNS_VALIDATION = Yup.string().matches(PRONOUNS_REGEX, 'Invalid characters :(');
export const EMAIL_VALIDATION = Yup.string().email('Invalid email address');
export const PHONE_VALIDATION = Yup.string().matches(PHONE_REGEX, 'Please enter a valid phone number.');

// this can include config for fields not used in this particular registration instance
export const FIELD_CONFIG = {
  first: {
    label: 'First name',
    validation: NAME_VALIDATION.required('Please enter first name.'),
    defaultValue: '',
    order: 1,
    width: 6,
    autoComplete: 'given-name'
  },
  last: {
    label: 'Last name',
    validation: NAME_VALIDATION.required('Please enter last name.'),
    defaultValue: '',
    order: 2,
    width: 6,
    autoComplete: 'family-name'
  },
  pronouns: {
    label: 'Pronouns',
    validation: PRONOUNS_VALIDATION,
    defaultValue: '',
    order: 4,
    width: 12
  },
  nametag: {
    label: 'Name for button',
    validation: NAME_VALIDATION,
    defaultValue: '',
    order: 3,
    width: 12
  },
  email: {
    label: 'Email',
    type: 'email',
    validation: EMAIL_VALIDATION.required('Please enter email address.'),
    defaultValue: '',
    order: 5,
    width: 6,
    autoComplete: 'email'
  },
  emailConfirmation: {
    label: 'Re-enter email',
    type: 'email',
    validation: EMAIL_VALIDATION.required('Please re-enter your email address.').oneOf([Yup.ref('email'), null], 'Email addresses must match.'),
    defaultValue: '',
    order: 6,
    width: 6,
    autoComplete: 'email'
  },
  phone: {
    label: 'Phone',
    type: 'tel',
    pattern: '###-###-####',
    placeholder: 'e.g. 555-555-5555',
    validation: PHONE_VALIDATION.required('Please enter phone number.'),
    defaultValue: '',
    order: 7,
    width: 12,
    // width: 4,
    autoComplete: 'tel'
  },
  address: {
    label: 'Street address',
    validation: Yup.string().required('Please enter street address.'),
    defaultValue: '',
    order: 8,
    width: 9,
    autoComplete: 'street-address'
  },
  apartment: {
    label: 'Apt, Suite, etc.',
    validation: Yup.string(),
    defaultValue: '',
    order: 9,
    width: 3,
    autoComplete: 'address-line2'
  },
  city: {
    label: 'City',
    validation: Yup.string().required('Please enter city.'),
    defaultValue: '',
    order: 10,
    width: 6,
    // width: 5,
    autoComplete: 'city'
  },
  state: {
    label: 'State / Province',
    validation: Yup.string().required('Please enter state or province.'),
    defaultValue: '',
    order: 11,
    width: 3,
    autoComplete: 'state'
  },
  zip: {
    label: 'Zip / Postal code',
    validation: Yup.string().required('Please enter zip/postal code.'),
    defaultValue: '',
    order: 12,
    width: 3,
    autoComplete: 'postal-code'
  },
  country: {
    label: 'Country',
    validation: Yup.string(),
    defaultValue: '',
    order: 13,
    width: 12,
    autoComplete: 'country',
    hidden: true
  },
  share: {
    title: "Roster",
    type: 'checkbox',
    label: "What information do you want shared in the roster?",
    options: [
      { label: 'Include my name in the roster', value: 'name' },
      { label: 'Include my email in the roster', value: 'email' },
      { label: 'Include my phone number in the roster', value: 'phone' },
      { label: 'Include my city, state, zip in the roster', value: 'location' },
    ],
    validation: Yup.array(),
    defaultValue: ['name', 'email', 'phone', 'location'],
    order: 20,
  },
  carpool: {
    type: 'checkbox',
    title: "Carpool",
    label: "Do you want your city, state, zip, and email shared for carpooling?",
    options: [
      { label: 'Yes', value: 'yes' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 30,
  },
  volunteer: {
    type: 'radio',
    title: "Volunteering",
    label: "Do you want to volunteer to help out over the weekend? Jobs might include sweeping or checking paper products stashed in the bathrooms.",
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No thanks', value: 'no' },
      { label: 'Other (please explain in comments below)', value: 'other' },
    ],
    validation: Yup.string(),
    defaultValue: '',
    order: 40,
  },
  dietaryPreferences: {
    type: 'radio',
    title: "Dietary Preferences",
    label: "Please choose one.",
    options: [
      { label: 'Vegan', value: 'vegan' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'No Red Meat', value: 'noredmeat' },
      { label: 'Omnivore', value: 'omnivore' },
    ],
    required: true,
    validation: Yup.string().required('Please select dietary preference.'),
    defaultValue: '',
    order: 21,
  },
  dietaryRestrictions: {
    type: 'checkbox',
    title: "Additional Dietary Restrictions",
    label: "Please note, we will try out best to accommodate you with the prepared meals, but the kitchen has limited options. They do their best,  but if you're very worried about your restrictions (if highly allergic, or highly specific requirements) we recommend bringing your own food as well. We have a refrigerator and storage space available for personal use that many campers use. There's room to elaborate on allergies or safety needs below.",
    options: [
      { label: 'Gluten-free', value: 'gluten' },
      { label: 'Soy-free', value: 'soy' },
      { label: 'Dairy-free', value: 'dairy' },
      { label: 'Kosher for Passover (stringent)', value: 'kosher-strict' },
      { label: "Kosher for Passover (chill, just won't eat bread)", value: 'kosher' },
      { label: 'Other (please explain in comments below)', value: 'other' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 22,
  },
  allergies: {
    type: 'textarea',
    title: 'Allergy / Safety Information',
    label: "So there's \"I don't eat gluten\" and then there's \"if a single crumb of gluten cross-contaminates my food I will be sick all weekend.\" Please elaborate as much are you need to feel comfortable that we know your safety and allergy needs. This can include non-food things as well.",
    validation: Yup.string(),
    defaultValue: '',
    order: 23,
    rows: 2
  },
  hospitality: {
    type: 'checkbox',
    title: "Housing",
    label: "Do you need housing or can you offer housing?",
    options: [
      { label: 'I can offer housing', value: 'offering' },
      { label: 'I need housing (limited availability)', value: 'requesting' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 23,
  },
  scholarship: {
    type: 'checkbox',
    title: "Scholarships (limited availability)",
    label: "We feel we've kept the price of camp remarkably low.  However, if you are limited financially, we have a small number of half price scholarships available for camp. If you'd like to be considered for one of these, please let us know.",
    options: [
      { label: 'Yes, please consider me for a scholarship', value: 'yes' },
    ],
    validation: Yup.array(),
    defaultValue: [],
    order: 24,
  },
  comments: {
    type: 'textarea',
    title: "Comments",
    label: "Please tell us any special requests or information we should know regarding your registration.",
    validation: Yup.string(),
    defaultValue: '',
    rows: 5,
    order: 25,
  },
  admissionCost: {
    validation: Yup.number().min(ADMISSION_COST_RANGE[0]).max(ADMISSION_COST_RANGE[1]).required(),
    defaultValue: ADMISSION_COST_DEFAULT,
  },
}

export const PERSON_INPUT_LABELS = [ 'Your contact information', 'Second admission', 'Third admission', 'Fourth admission' ];

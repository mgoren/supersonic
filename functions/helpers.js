import { logger } from 'firebase-functions/v2';

export function handleError(message, err) {
  logger.error(message, err);
  throw new Error(message);
}

export const joinArrays = (obj) => {
  const newObj = { ...obj };
  for (let key in obj) {
    if (key !== 'people' && Array.isArray(obj[key])) {
      newObj[key] = obj[key].join(', ');
    }
  }
  return newObj;
};

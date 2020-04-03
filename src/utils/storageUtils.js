import { isNil } from 'ramda';

// ADD
export const addToLocalStorage = (value, storageKey) => {
  if (!isNil(value)) {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }
};

// DELETE
export const deleteFromLocalStorage = (storageKey) => {
  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('Could not remove item from local storage');
  }
};

  // LOAD
export const loadFromLocalStorage = (storageKey, defaultValue) => {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey)) || defaultValue;
  } catch (error) {
    console.warn('Could not get read local storage');
  }
  return null;
};

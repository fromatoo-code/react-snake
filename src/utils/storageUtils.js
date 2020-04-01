import { isNil } from 'ramda';

// ADD
export const addToLocalStorage = (value, storageKey) => {
  if (!isNil(value)) {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }
};
export const addToSessionStorage = (value, storageKey) => {
  if (!isNil(value)) {
    window.sessionStorage.setItem(storageKey, JSON.stringify(value));
  }
};
export const addToStorage = (value, storageKey) => {
  addToLocalStorage(value, storageKey);
  addToSessionStorage(value, storageKey);
};

// DELETE
export const deleteFromLocalStorage = (storageKey) => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Could not remove item from local storage');
    }
  };
  export const deleteFromSessionStorage = (storageKey) => {
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Could not remove item from session storage');
    }
  };
  export const deleteFromStorage = (storageKey) => {
    deleteFromLocalStorage(storageKey);
    deleteFromSessionStorage(storageKey);
  };

  // LOAD
  export const loadFromSessionStorage = (storageKey) => {
    try {
      return JSON.parse(window.sessionStorage.getItem(storageKey));
    } catch (error) {
      console.warn('Could not get read session storage');
    }
    return null;
  };
  export const loadFromLocalStorage = (storageKey, defaultValue) => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || defaultValue;
    } catch (error) {
      console.warn('Could not get read local storage');
    }
    return null;
  }
  export const loadFromStorage = (storageKey, initialValue = null) => {
    const sessionStorageItem = loadFromSessionStorage(storageKey);
    if (!isNil(sessionStorageItem)) return sessionStorageItem;
    const localStorageItem = loadFromLocalStorage(storageKey);
    if (!isNil(localStorageItem)) return localStorageItem;
    return initialValue;
  }

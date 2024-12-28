export const getValue = key => localStorage.getItem(key);

export const setValue = (key, value) => localStorage.setItem(key, value);

export const removeValue = key => localStorage.removeItem(key);

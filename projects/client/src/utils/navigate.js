import router from '../router';
import { clearPage } from './dom';

export const navigate = (url, state = {}) => {
  window.history.pushState(state, 'Пісенник', url);
  clearPage();
  document.querySelector('dialog').close();
  router(url);
};

export const navigateBack = () => {
  window.history.back();
};

export const replace = (url, state = {}) =>
  window.history.replaceState(state, 'Пісенник', url);

export const compareURL = (url, schema) => {
  const urlParts = url.split('?')[0].split('/').filter(Boolean);
  const schemaParts = schema.split('/').filter(Boolean);

  if (urlParts.length !== schemaParts.length) {
    return false;
  }

  return schemaParts.every(
    (part, index) => part.startsWith(':') || part === urlParts[index]
  );
};

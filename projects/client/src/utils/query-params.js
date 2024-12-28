import { replace } from './navigate';

export const getQueryParam = key => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

export const setQueryParam = (key, value) => {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  replace(url);
};

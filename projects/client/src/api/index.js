import { getValue, removeValue, setValue } from '../utils/local-storage';
import { API_URLS, PAGES, STATUS_CODES } from '../constants';
import { navigate } from '../utils/navigate';
import { deleteUser } from '../state/user';
import { clearState } from '../state';
import { isLoggedIn } from '../features/auth';
import { getURLWithQueryParams } from '../utils/query-params';

const API_URL = '/api';

const getAuthHeader = () => {
  const token = getValue('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const refreshTokens = async (url, options) => {
  const res = await fetch(API_URL + API_URLS.REFRESH, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    deleteUser();
    removeValue('token');
    clearState();
    return navigate(PAGES.HOME);
  }

  const { accessToken } = await handleResponse(res);
  setValue('token', accessToken);

  return await fetch(url, {
    ...options,
    headers: { ...options.headers, ...getAuthHeader() }, // pass new auth token
  }).then(handleResponse);
};

const handleResponse = async (response, url, options) => {
  if (
    [STATUS_CODES.FORBIDDEN, STATUS_CODES.UNAUTHORIZED].includes(
      response.status
    ) &&
    url &&
    isLoggedIn()
  ) {
    return await refreshTokens(url, options);
  }
  if (
    [STATUS_CODES.TOO_MANY_REQUESTS, STATUS_CODES.GATEWAY_TIMEOUT].includes(
      response.status
    )
  ) {
    return navigate(PAGES.ERROR, { status: response.status });
  }

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(json.message);
  }
  if (json) {
    return json;
  }
};

export const getRequest = async (path, params = {}, query = {}) => {
  const url = getURLWithQueryParams(API_URL + path, query);
  const options = {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: getAuthHeader(),
    ...params,
  };

  return fetch(url, options).then(data => handleResponse(data, url, options));
};

export const postRequest = async (path, body, params = {}) => {
  const url = API_URL + path;
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
    ...params,
  };
  return fetch(url, options).then(data =>
    handleResponse(data, url, options, true)
  );
};

export const putRequest = async (path, body, params = {}) => {
  const url = API_URL + path;
  const options = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
    ...params,
  };
  return fetch(url, options).then(data =>
    handleResponse(data, url, options, true)
  );
};

export const deleteRequest = async (path, params = {}) => {
  const url = API_URL + path;
  const options = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...getAuthHeader(),
    },
    ...params,
  };
  return fetch(url, options).then(data =>
    handleResponse(data, url, options, true)
  );
};

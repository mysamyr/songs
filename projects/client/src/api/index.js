import { getValue, removeValue, setValue } from '../utils/local-storage';
import { API_URLS, PAGES, STATUS_CODES } from '../constants';
import { navigate } from '../utils/navigate';
import { deleteUser } from '../state/user';
import { clearState } from '../state';
import { isLoggedIn } from '../features/auth';

const API_URL = '/api';

const getAuthHeader = () => {
  const token = getValue('token');
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const refreshTokens = async (url, options) => {
  const data = await fetch(API_URL + API_URLS.REFRESH, {
    method: 'GET',
    credentials: 'include',
  });

  if (!data.ok) {
    deleteUser();
    removeValue('token');
    clearState();
    return navigate(PAGES.HOME);
  }

  const { accessToken } = await handleResponse(data);
  setValue('token', accessToken);

  return fetch(url, {
    ...options,
    headers: { ...options.headers, ...getAuthHeader() }, // pass new auth token
  }).then(handleResponse);
};

// todo fix issue with accessToken after refresh
const handleResponse = async (data, url, options) => {
  if (
    [STATUS_CODES.FORBIDDEN, STATUS_CODES.UNAUTHORIZED].includes(data.status) &&
    url &&
    isLoggedIn()
  ) {
    return refreshTokens(url, options);
  }
  if (
    [STATUS_CODES.TOO_MANY_REQUESTS, STATUS_CODES.GATEWAY_TIMEOUT].includes(
      data.status
    )
  ) {
    return navigate(PAGES.ERROR, { status: data.status });
  }

  const json = await data.json().catch(() => null);
  if (!data.ok) {
    throw new Error(json.message);
  }
  if (json) {
    return json;
  }
};

export const getRequest = async (path, params = {}, query = {}) => {
  const url = API_URL + path + new URLSearchParams(query).toString();
  const options = {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      ...getAuthHeader(),
    },
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

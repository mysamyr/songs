import { getRequest, postRequest } from './index';
import { API_URLS } from '../constants';

export const activate = async (id, params) =>
  getRequest(API_URLS.ACTIVATE_$(id), params);

export const signup = async body => postRequest(API_URLS.SIGNUP, body);

export const login = async body => postRequest(API_URLS.SIGNIN, body);

export const logout = async () => getRequest(API_URLS.LOGOUT);

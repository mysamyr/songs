import { deleteRequest, getRequest, postRequest, putRequest } from './index';
import { API_URLS } from '../constants';

export const activate = async (id, params) =>
  getRequest(API_URLS.ACTIVATE_$(id), params);

export const signup = async body => postRequest(API_URLS.SIGNUP, body);

export const login = async body => postRequest(API_URLS.SIGNIN, body);

export const logout = async () => getRequest(API_URLS.LOGOUT);

export const checkActivationId = async (id, params) =>
  getRequest(API_URLS.CHECK_ACTIVATION_ID(id), params);

export const forgotPassword = async body =>
  putRequest(API_URLS.FORGOT_PASSWORD, body);

export const recoverPassword = async (id, body) =>
  putRequest(API_URLS.PASSWORD_RECOVER(id), body);

export const changeUserEmail = async body =>
  putRequest(API_URLS.CHANGE_EMAIL, body);

export const changeUserPassword = async body =>
  putRequest(API_URLS.CHANGE_PASSWORD, body);

export const deleteUserAccount = async () =>
  deleteRequest(API_URLS.DELETE_ACCOUNT);

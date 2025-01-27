import { deleteRequest, getRequest, postRequest } from './index';
import { API_URLS } from '../constants';

export const changeEmail = async body =>
  postRequest(API_URLS.CHANGE_EMAIL, body);

export const changePassword = async body =>
  postRequest(API_URLS.CHANGE_PASSWORD, body);

export const resendVerification = async () =>
  getRequest(API_URLS.RESEND_VALIDATION);

export const deleteAccount = async () => deleteRequest(API_URLS.DELETE_ACCOUNT);

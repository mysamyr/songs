import { deleteRequest, getRequest, postRequest } from './index';
import { API_URLS } from '../constants';

export const getCategories = async params =>
  getRequest(API_URLS.GET_CATEGORIES, params);

export const getCategory = async (id, params) =>
  getRequest(API_URLS.GET_CATEGORY(id), params);

export const createCategory = async body =>
  postRequest(API_URLS.CREATE_CATEGORY, body);

export const deleteCategory = async id =>
  deleteRequest(API_URLS.DELETE_CATEGORY(id));

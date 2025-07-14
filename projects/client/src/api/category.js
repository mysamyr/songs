import { deleteRequest, getRequest, postRequest, putRequest } from './index';
import { API_URLS } from '../constants';

export const getCategories = async (queryParams, params) =>
  getRequest(API_URLS.GET_CATEGORIES, params, queryParams);

export const getCategory = async (id, queryParams, params) =>
  getRequest(API_URLS.GET_CATEGORY(id), params, queryParams);

export const createCategory = async body =>
  postRequest(API_URLS.CREATE_CATEGORY, body);

export const renameCategory = async (id, body) =>
  putRequest(API_URLS.RENAME_CATEGORY(id), body);

export const deleteCategory = async id =>
  deleteRequest(API_URLS.DELETE_CATEGORY(id));

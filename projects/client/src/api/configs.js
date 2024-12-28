import { deleteRequest, getRequest, postRequest, putRequest } from './index';
import { API_URLS } from '../constants';

export const getConfigs = async ({ params, query }) =>
  getRequest(API_URLS.GET_CONFIGS, params, query);

export const getConfigData = async (id, params) =>
  getRequest(API_URLS.GET_CONFIG_DATA_$(id), params);

export const createConfig = async body =>
  postRequest(API_URLS.CREATE_NEW_CONFIG, body);

export const updateConfig = async (id, body) =>
  putRequest(API_URLS.UPDATE_CONFIG_$(id), body);

export const deleteConfig = async id =>
  deleteRequest(API_URLS.DELETE_CONFIG_$(id));

import { deleteRequest, getRequest, postRequest, putRequest } from './index';
import { API_URLS } from '../constants';

export const getRootLists = async (_, params) =>
  getRequest(API_URLS.GET_ROOT_LISTS, params);

export const getListTree = async (id, params) =>
  getRequest(API_URLS.GET_LISTS_TREE_$(id), params);

export const getLists = async (id, params) =>
  getRequest(API_URLS.GET_LISTS_$(id), params);

export const getListItemData = async (id, itemId, params) =>
  getRequest(API_URLS.GET_LIST_ITEM_DATA_$(id, itemId), params);

export const createRootList = async body =>
  postRequest(API_URLS.CREATE_NEW_ENTRY_LIST, body);

export const createList = async (id, body) =>
  postRequest(API_URLS.CREATE_NEW_LIST_$(id), body);

export const createListItem = async (id, body) =>
  postRequest(API_URLS.CREATE_NEW_LIST_ITEM_$(id), body);

export const updateList = async (id, body) =>
  putRequest(API_URLS.UPDATE_LIST_$(id), body);

export const updateListItem = async (id, itemId, body) =>
  putRequest(API_URLS.UPDATE_LIST_ITEM_$(id, itemId), body);

export const moveList = async (id, body) =>
  putRequest(API_URLS.MOVE_LIST_$(id), body);

export const clearCompletedList = async id =>
  putRequest(API_URLS.CLEAR_LIST_ITEMS_$(id), {});

export const deleteList = async id => deleteRequest(API_URLS.DELETE_LIST_$(id));

export const deleteListItem = async (id, itemId) =>
  deleteRequest(API_URLS.DELETE_LIST_ITEM_$(id, itemId));

import { deleteRequest, getRequest, postRequest, putRequest } from './index';
import { API_URLS } from '../constants';

export const getSong = async (id, params) =>
  getRequest(API_URLS.GET_SONG(id), params);

export const createSong = async body => postRequest(API_URLS.CREATE_SONG, body);

export const editSong = async (id, body) =>
  putRequest(API_URLS.EDIT_SONG(id), body);

export const deleteSong = async id => deleteRequest(API_URLS.DELETE_SONG(id));

import { login as loginAPI, logout as logoutAPI } from '../api/auth';
import { getValue, removeValue, setValue } from '../utils/local-storage';
import { deleteUser, saveUser } from '../state/user';
import { navigate } from '../utils/navigate';
import { PAGES } from '../constants';
import { clearState } from '../state';

export const isLoggedIn = () => getValue('user') && getValue('token');

export const login = async ({ email, password }) => {
  const tokens = await loginAPI({ email, password });
  setValue('token', tokens.accessToken);
  saveUser({ email });
  navigate(PAGES.LISTS);
};

export const logout = async () => {
  await logoutAPI();
  deleteUser();
  removeValue('token');
  clearState();
  navigate(PAGES.LOGIN);
};

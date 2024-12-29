import { PAGES } from '../constants';
import { login as loginAPI, logout as logoutAPI } from '../api/auth';
import { deleteUser, saveUser } from '../state/user';
import { clearState } from '../state';
import { getValue, removeValue, setValue } from '../utils/local-storage';
import { navigate } from '../utils/navigate';

export const isLoggedIn = () => getValue('user') && getValue('token');

export const login = async ({ email, password }) => {
  // todo validated, admin
  const { accessToken, name } = await loginAPI({ email, password });
  setValue('token', accessToken);
  saveUser({ email, name });
  navigate(PAGES.HOME);
};

export const logout = async () => {
  await logoutAPI();
  deleteUser();
  removeValue('token');
  clearState();
  navigate(PAGES.HOME);
};

import { getValue, removeValue, setValue } from '../utils/local-storage';

export const saveUser = user => {
  setValue('user', JSON.stringify(user));
};

export const deleteUser = () => {
  removeValue('user');
};

export const getUser = () => JSON.parse(getValue('user'));

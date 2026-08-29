import { URL } from '../../config/index.js';

export const getLinkForVerification = id => `${URL}auth/verify/${id}`;

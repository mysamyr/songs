import { PAGES } from './index';
import { navigate } from '../utils/navigate';
import { isLoggedIn, logout } from '../features/auth';

export default [
  {
    text: 'Головна',
    active: url => url === PAGES.HOME,
    onClick: () => navigate(PAGES.HOME),
  },
  {
    text: 'Пісенник',
    active: url => [PAGES.CATEGORIES, '/song'].some(i => url.includes(i)),
    onClick: () => navigate(PAGES.CATEGORIES),
  },
  {
    text: 'Літургія',
    active: url => url === PAGES.LITURGY,
    onClick: () => navigate(PAGES.LITURGY),
  },
  {
    text: 'Панахида',
    active: url => url === PAGES.PANAKHYDA,
    onClick: () => navigate(PAGES.PANAKHYDA),
  },
  {
    text: 'Кабінет',
    active: url => url === PAGES.CABINET,
    visible: () => isLoggedIn(),
    onClick: () => navigate(PAGES.CABINET),
  },
  {
    text: 'Вийти',
    visible: () => isLoggedIn(),
    onClick: logout,
  },
  {
    text: 'Увійти',
    active: url => url === PAGES.AUTH,
    visible: () => !isLoggedIn(),
    onClick: () => navigate(PAGES.AUTH),
  },
];

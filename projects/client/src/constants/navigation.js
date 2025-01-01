import { PAGES } from './index';
import { isLoggedIn, logout } from '../features/auth';
import Snackbar from '../features/snackbar';
import { navigate } from '../utils/navigate';

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
    onClick: async () => {
      await logout();
      Snackbar.displayMsg('Ви вийшли з облікового запису');
    },
  },
  {
    text: 'Увійти',
    active: url => url === PAGES.AUTH,
    visible: () => !isLoggedIn(),
    onClick: () => navigate(PAGES.AUTH),
  },
];

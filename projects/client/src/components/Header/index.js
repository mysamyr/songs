import { Div, Menu, UList, ListItem } from '../';
import { PAGES } from '../../constants';
import { navigate } from '../../utils/navigate';
import { isLoggedIn, logout } from '../../features/auth';

const navLinks = [
  {
    text: 'Головна',
    href: PAGES.HOME,
  },
  {
    text: 'Пісенник',
    href: PAGES.CATEGORIES,
  },
  {
    text: 'Літургія',
    href: PAGES.LITURGY,
  },
  {
    text: 'Панахида',
    href: PAGES.PANAKHYDA,
  },
];

export default () => {
  const isAuth = isLoggedIn();
  const container = Div({
    className: 'header-container',
  });
  const navList = UList({
    className: 'nav-list',
  });
  navLinks.forEach(link => {
    navList.appendChild(
      ListItem({
        text: link.text,
        className: 'nav-list-item link',
        onClick: () => navigate(link.href),
      })
    );
  });

  if (isAuth) {
    navList.appendChild(
      ListItem({
        text: 'Кабінет',
        className: 'nav-list-item link',
        onClick: () => navigate(PAGES.CABINET),
      })
    );
    navList.appendChild(
      ListItem({
        text: 'Вийти',
        className: 'nav-list-item link',
        onClick: logout,
      })
    );
  } else {
    navList.appendChild(
      ListItem({
        text: 'Увійти',
        className: 'nav-list-item link',
        onClick: () => navigate(PAGES.AUTH),
      })
    );
  }

  const trigger = Menu();
  trigger.classList.add('sidenav-trigger');

  container.append(
    Div({
      className: 'logo link',
      text: 'Пісенник',
      onClick: () => navigate(PAGES.HOME),
    }),
    navList,
    trigger
  );

  return container;
};

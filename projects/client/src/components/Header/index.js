import { Div, Menu, UList, ListItem } from '../';
import { PAGES } from '../../constants';
import { navigate } from '../../utils/navigate';
import { isLoggedIn, logout } from '../../features/auth';

const navLinks = [
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

// todo reformat this
export default () => {
  const container = Div({
    className: 'header-container',
  });
  const navList = UList({
    className: 'nav-list',
  });
  navLinks.forEach(link => {
    if (link.visible && !link.visible()) return;
    const isActive =
      link.active && link.active(window.location.pathname) ? 'active' : '';
    navList.appendChild(
      ListItem({
        text: link.text,
        className: `nav-list-item link ${isActive}`,
        onClick: link.onClick,
      })
    );
  });

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

import { Div, MenuIcon, UList, ListItem } from '../';
import { PAGES } from '../../constants';
import navigationLinks from '../../constants/navigation';
import { navigate } from '../../utils/navigate';
import { openSidebar } from '../../features/sidebar';

export default () => {
  const container = Div({
    className: 'header-container',
  });
  const navList = UList({
    className: 'nav-list',
  });
  navigationLinks.forEach(link => {
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

  const trigger = MenuIcon({
    color: 'var(--white)',
    className: 'sidebar-trigger',
    onClick: openSidebar,
  });

  container.append(
    trigger,
    Div({
      className: 'logo link',
      text: 'Пісенник',
      onClick: () => navigate(PAGES.HOME),
    }),
    navList
  );

  return container;
};

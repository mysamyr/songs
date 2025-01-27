import navigationLinks from '../../constants/navigation';
import { Div, ListItem, UList } from '../';

export default () => {
  const container = Div({
    className: 'sidebar slide-in',
  });
  const navList = UList({
    className: 'sidebar-list',
  });

  navigationLinks.forEach(link => {
    if (link.visible && !link.visible()) return;
    const isActive =
      link.active && link.active(window.location.pathname) ? 'active' : '';
    navList.appendChild(
      ListItem({
        text: link.text,
        className: `center sidebar-list-item link ${isActive}`,
        onClick: link.onClick,
      })
    );
  });

  container.appendChild(navList);

  return container;
};

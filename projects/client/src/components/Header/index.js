import { HEADER_ICONS } from '../../constants';
import { SortModal, Back, Menu, Sort, Edit, Div, Header1 } from '../';
import { clearLists } from '../../state';
import { navigateBack } from '../../utils/navigate';
import { showModal } from '../../features/modal';
import { openSidebar } from '../../features/sidebar';

const getIcon = (iconName, onClick) => {
  const config = {
    [HEADER_ICONS.BACK]: {
      Icon: Back,
      fn: () => {
        clearLists();
        return navigateBack();
      },
    },
    [HEADER_ICONS.MENU]: {
      Icon: Menu,
      fn: () => {
        openSidebar();
      },
    },
    [HEADER_ICONS.SORT]: {
      Icon: Sort,
      fn: () => {
        showModal(SortModal({ onSubmit: onClick }));
      },
    },
    [HEADER_ICONS.EDIT]: {
      Icon: Edit,
      fn: onClick,
    },
    '': {
      Icon: () => Div(),
    },
  };
  return config[iconName];
};

const HeaderIcon = ({ iconName = '', onClick }) => {
  const { Icon, fn } = getIcon(iconName, onClick);

  const container = Div({
    onClick: fn,
  });
  container.appendChild(Icon());
  return container;
};

export default ({ title, leftContent, rightContent, onClick }) => {
  const container = Div({
    className: 'header-container',
  });
  container.append(
    HeaderIcon({ iconName: leftContent }),
    Header1({
      className: 'header-title',
      text: title,
    }),
    HeaderIcon({ iconName: rightContent, onClick })
  );

  return container;
};

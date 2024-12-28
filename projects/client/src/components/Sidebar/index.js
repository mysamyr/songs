import { PAGES } from '../../constants';
import { Div, Logout, Light, Dark } from '../';
import { clearConfigs, clearLists, clearState } from '../../state';
import { navigate } from '../../utils/navigate';
import { getValue } from '../../utils/local-storage';
import { logout } from '../../features/auth';
import { changeTheme } from '../../features/theme';

export default () => {
  const isLightTheme = !getValue('theme');

  const toggleTheme = () => {
    const iconElement = document.getElementById('theme-button');
    iconElement.innerText = '';
    iconElement.appendChild(getValue('theme') ? Dark() : Light());
    changeTheme();
  };
  const onClickLists = () => {
    navigate(PAGES.LISTS);
    clearConfigs();
  };
  const onClickConfigs = () => {
    navigate(PAGES.CONFIGS);
    clearLists();
  };
  const onClickCabinet = () => {
    navigate(PAGES.CABINET);
    clearState();
  };
  const onClickLogout = async () => {
    await logout();
  };

  const container = Div({
    className: 'sidebar slide-in',
  });

  const links = Div({
    className: 'sidebar-options',
  });
  links.append(
    Div({
      text: 'Lists',
      className: 'sidebar-option',
      onClick: onClickLists,
    }),
    Div({
      text: 'Configs',
      className: 'sidebar-option',
      onClick: onClickConfigs,
    }),
    Div({
      text: 'Cabinet',
      className: 'sidebar-option',
      onClick: onClickCabinet,
    })
  );
  container.appendChild(links);

  const buttons = Div({
    className: 'btns sidebar-button',
  });
  const themeButton = Div({
    id: 'theme-button',
    onClick: toggleTheme,
  });
  themeButton.appendChild(isLightTheme ? Dark() : Light());
  const logoutButton = Div({
    onClick: onClickLogout,
  });
  logoutButton.appendChild(Logout());
  buttons.append(themeButton, logoutButton);
  container.appendChild(buttons);
  return container;
};

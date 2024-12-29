import { PAGES } from '../../constants';
import { Div } from '../';
import { clearConfigs, clearLists, clearState } from '../../state';
import { navigate } from '../../utils/navigate';
// import { logout } from '../../features/auth';

export default () => {
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
  // const onClickLogout = async () => {
  //   await logout();
  // };

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

  return container;
};

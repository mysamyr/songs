import { Header, AddButton, ListItem, Div } from '../../components';
import { HEADER_ICONS, PAGES } from '../../constants';
import { navigate } from '../../utils/navigate';
import { getConfigs as getConfigsAPI } from '../../api/configs';
import { getConfigs, setConfigData, setConfigs } from '../../state';
import { showModal } from '../../features/modal';
import ListOptions from './ListOptions';
import Snackbar from '../../features/snackbar';
import { logError } from '../../utils/helpers';

const ConfigsContent = configs => {
  const onClickListItem = data => {
    setConfigData(data);
    navigate(PAGES.CONFIG(data.id));
  };

  const onClickOptions = (e, { id, name }) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(ListOptions({ id, name }));
  };

  return configs.map(item =>
    ListItem({
      data: item,
      name: item.name,
      className: item.isDefault ? 'list' : 'list list-item',
      onClickListItem,
      hideOptions: !!item.isDefault,
      onClickOptions,
    })
  );
};

export default async () => {
  try {
    const configs = await getConfigsAPI({});
    if (!configs) {
      return;
    }
    setConfigs(configs);
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }

  const configs = getConfigs();

  const onClickAdd = () => {
    navigate(PAGES.NEW_CONFIG);
  };

  document.getElementById('root').append(
    Header({
      title: 'Configs',
      leftContent: HEADER_ICONS.MENU,
    }),
    ...ConfigsContent(configs),
    Div({
      className: 'margin-bottom',
    }),
    AddButton({
      onClick: onClickAdd,
    })
  );
};

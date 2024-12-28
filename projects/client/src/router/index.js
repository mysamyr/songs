import { PAGES } from '../constants';
import AuthPage from '../pages/Auth';
import ErrorPage from '../pages/Error';
import ActivationPage from '../pages/Activation';
import ListsPage from '../pages/Lists';
import AddListPage from '../pages/AddList';
import ListDetailsPage from '../pages/ListItem';
import AddConfigPage from '../pages/AddConfig';
import ConfigsPage from '../pages/Configs';
import ConfigDetailsPage from '../pages/ConfigDetails';
import CabinetPage from '../pages/Cabinet';
import ChangePasswordPage from '../pages/ChangePassword';
import { compareURL, navigate } from '../utils/navigate';
import { isLoggedIn } from '../features/auth';

export default url => {
  if (compareURL(url, PAGES.ACTIVATE)) {
    ActivationPage();
    return;
  }
  if (compareURL(url, PAGES.RECOVERY)) {
    ChangePasswordPage();
    return;
  }
  if (isLoggedIn()) {
    if (compareURL(url, PAGES.LISTS) || compareURL(url, PAGES.LIST_URL))
      ListsPage();
    else if (compareURL(url, PAGES.NEW_LIST)) AddListPage();
    else if (compareURL(url, PAGES.ERROR)) ErrorPage();
    else if (compareURL(url, PAGES.LIST_ITEM_URL)) ListDetailsPage();
    else if (compareURL(url, PAGES.NEW_CONFIG)) AddConfigPage();
    else if (compareURL(url, PAGES.CONFIGS)) ConfigsPage();
    else if (compareURL(url, PAGES.CONFIG_URL)) ConfigDetailsPage();
    else if (compareURL(url, PAGES.CABINET)) CabinetPage();
    else navigate(PAGES.LISTS);
  } else {
    if (compareURL(url, PAGES.LOGIN)) AuthPage();
    else navigate(PAGES.LOGIN);
  }
};

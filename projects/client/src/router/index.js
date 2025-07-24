import { PAGES } from '../constants';
import HomePage from '../pages/Home';
import ErrorPage from '../pages/Error';
import LiturgyPage from '../pages/Text/Liturgy';
import PanachydaPage from '../pages/Text/Panachyda';
import VinchanniaPage from '../pages/Text/Vinchannia';
import AuthPage from '../pages/Auth';
import CategoriesPage from '../pages/Categories';
import CategoryPage from '../pages/Category';
import AllSongsPage from '../pages/AllSongs';
import SongPage from '../pages/Song';
import NewCategoryPage from '../pages/NewCategory';
import NewSongPage from '../pages/NewSong';
import EditSongPage from '../pages/EditSong';
import ActivationPage from '../pages/Activation';
import CabinetPage from '../pages/Cabinet';
import { compareURL, navigate } from '../utils/navigate';
import { isLoggedIn } from '../features/auth';

export default url => {
  // public pages
  if (compareURL(url, PAGES.HOME)) return HomePage();
  if (compareURL(url, PAGES.ERROR)) return ErrorPage();
  if (compareURL(url, PAGES.LITURGY)) return LiturgyPage();
  if (compareURL(url, PAGES.PANAKHYDA)) return PanachydaPage();
  if (compareURL(url, PAGES.VINCHANNIA)) return VinchanniaPage();
  if (compareURL(url, PAGES.CATEGORIES)) return CategoriesPage();
  if (compareURL(url, PAGES.ALL_SONGS)) return AllSongsPage();
  if (compareURL(url, PAGES.ACTIVATED)) return ActivationPage();

  // restricted pages
  if (isLoggedIn()) {
    if (compareURL(url, PAGES.CABINET)) return CabinetPage();
    if (compareURL(url, PAGES.NEW_CATEGORY)) return NewCategoryPage();
    if (compareURL(url, PAGES.NEW_SONG)) return NewSongPage();
    if (compareURL(url, PAGES.EDIT_SONG)) return EditSongPage();
  } else {
    // not logged in pages
    if (compareURL(url, PAGES.AUTH)) return AuthPage();
  }
  // paths with dynamic parameters
  if (compareURL(url, PAGES.CATEGORY)) return CategoryPage();
  if (compareURL(url, PAGES.SONG)) return SongPage();
  return navigate(PAGES.HOME);
};

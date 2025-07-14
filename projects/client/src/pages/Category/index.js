import {
  Button,
  Div,
  EditIcon,
  Header1,
  Paragraph,
  RenameModal,
  Searchbar,
  SubmitModal,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES, PAGINATION_LIMIT } from '../../constants';
import {
  deleteCategory as deleteCategoryAPI,
  getCategory as getCategoryAPI,
  renameCategory as renameCategoryAPI,
} from '../../api/category';
import { getCategory, setCategories, setCategory } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import { validateCategory } from '../../utils/validation';
import Snackbar from '../../features/snackbar';
import { isLoggedIn } from '../../features/auth';
import { showModal } from '../../features/modal';
import { isUserAdmin } from '../../state/user';
import {
  ADD_NEW_SONG,
  DELETE_CATEGORY,
  DELETE_CATEGORY_QUESTION,
  NO_SONGS,
} from './messages';
import { BACK_TO_CATEGORIES } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';
import {
  getQueryParam,
  getURLWithQueryParams,
} from '../../utils/query-params.js';

const onTypeSearch = searchValue => {
  const categoryId = window.location.pathname.split('/')[2];
  const search = getQueryParam('search');
  const value = searchValue.toLowerCase().trim();

  if (value === search) {
    return;
  }

  return navigate(
    getURLWithQueryParams(PAGES.CATEGORY_$(categoryId), { search: value })
  );
};

const addSongs = list => {
  document.getElementById('songs').append(...list);
};

const getSongCard = song =>
  Div({
    className: 'card link',
    text: capitalizeFirstLetter(song.name),
    onClick: () => navigate(PAGES.SONG_$(song.id)),
  });

const loadMoreSongs = async () => {
  const categoryId = window.location.pathname.split('/')[2];
  const originalSongs = getCategory().songs;
  try {
    const { songs } = await getCategoryAPI(categoryId, {
      skip: originalSongs.length,
      limit: PAGINATION_LIMIT,
    });

    if (!songs.length) {
      document.getElementById('more-btn').remove();
      return;
    }

    if (songs.length < PAGINATION_LIMIT) {
      document.getElementById('more-btn').remove();
    }
    setCategories([...originalSongs, ...songs]);
    addSongs(songs.map(getSongCard));
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
  }
};

const onDeleteCategory = async id => {
  try {
    await deleteCategoryAPI(id);
    navigate(PAGES.CATEGORIES);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
  }
};

const onRenameCategory = (categoryId, prevName) => async e => {
  e.preventDefault();
  const newName = e.target.name.value;

  const { error, value } = validateCategory(newName, prevName);
  if (error) return Snackbar.displayMsg(error);
  try {
    await renameCategoryAPI(categoryId, value);
    navigate(PAGES.CATEGORY_$(categoryId));
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
  }
};

const headerBlock = ({
  categoryId,
  isAdmin = isUserAdmin(),
  categoryName,
  searchValue,
}) => {
  const container = Div({ className: 'category-header-container' });
  const nameContainer = Div({ className: 'category-header-container' });
  nameContainer.appendChild(
    Header1({
      text: categoryName,
      className: 'category-header',
    })
  );
  if (isAdmin) {
    nameContainer.appendChild(
      EditIcon({
        className: 'rename-icon',
        onClick: () =>
          showModal(
            RenameModal({
              name: categoryName,
              onSubmit: onRenameCategory(categoryId, categoryName),
            })
          ),
      })
    );
  }

  const searchContainer = Searchbar({
    value: searchValue,
    onSearch: onTypeSearch,
  });

  container.append(nameContainer, searchContainer);

  return container;
};

const songsBlock = (songs = getCategory().songs) => {
  const container = Div({ id: 'songs' });

  if (songs.length) {
    songs.forEach(song => {
      const card = getSongCard(song);
      container.appendChild(card);
    });
  } else {
    container.append(
      Paragraph({
        text: NO_SONGS,
      })
    );
  }

  return container;
};

const loadMoreBtn = (songs = getCategory().songs) => {
  const container = Div({
    className: 'btns',
  });

  if (songs.length === PAGINATION_LIMIT) {
    container.append(
      Div({
        id: 'more-btn',
        text: 'Показати більше',
        onClick: loadMoreSongs,
      })
    );
  }

  return container;
};

const buttonsBlock = ({
  categoryId,
  isAdmin = isUserAdmin(),
  isAuth = isLoggedIn(),
  songs = getCategory().songs,
}) => {
  const container = Div({
    className: 'btns',
  });
  container.appendChild(
    Button({
      onClick: () => navigate(PAGES.CATEGORIES),
      text: BACK_TO_CATEGORIES,
      color: 'blue',
    })
  );
  if (isAuth) {
    container.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_SONG, { categoryId }),
        text: ADD_NEW_SONG,
        color: 'green',
      })
    );
  }
  if (!songs.length && isAdmin) {
    container.appendChild(
      Button({
        onClick: () =>
          showModal(
            SubmitModal({
              onConfirm: () => onDeleteCategory(categoryId),
              question: DELETE_CATEGORY_QUESTION,
              inverseColors: true,
            })
          ),
        text: DELETE_CATEGORY,
        color: 'red',
      })
    );
  }

  return container;
};

export default async () => {
  const categoryId = window.location.pathname.split('/')[2];
  const search = getQueryParam('search');

  try {
    const category = await getCategoryAPI(categoryId, {
      search,
      skip: 0,
      limit: PAGINATION_LIMIT,
    });
    if (!category) {
      return;
    }
    setCategory(category);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const { name } = getCategory();

  const categoryName = capitalizeFirstLetter(name);

  const container = Div({
    className: 'container',
  });

  container.append(
    headerBlock({ categoryId, categoryName, searchValue: search }),
    songsBlock(),
    loadMoreBtn(),
    buttonsBlock({ categoryId })
  );

  renderPageWithHeader(categoryName, container);
};

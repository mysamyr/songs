import {
  Button,
  Div,
  EditIcon,
  Header1,
  Paragraph,
  RenameModal,
  Searchbar,
  SearchIcon,
  SubmitModal,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import {
  deleteCategory as deleteCategoryAPI,
  getCategory as getCategoryAPI,
  renameCategory as renameCategoryAPI,
} from '../../api/category';
import { getCategory, setCategory } from '../../state';
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
import { getAllSongs } from '../../api/song';
import { renderPageWithHeader } from '../../utils/dom';

const onTypeSearch = e => {
  const value = e.target.value.toLowerCase().trim();
  const { songs } = getCategory();
  if (!songs.length) {
    return;
  }
  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(value)
  );

  renderSongs(songsBlock(filteredSongs));
};

const renderSongs = list => {
  document.getElementById('songs')?.remove();
  document.querySelector('.category-header-container').after(list);
};

const headerBlock = ({ isAdmin, name, onRenameCategory }) => {
  const container = Div({ className: 'category-header-container' });
  const nameContainer = Div({ className: 'category-header-container' });
  nameContainer.appendChild(
    Header1({
      text: capitalizeFirstLetter(name),
      className: 'category-header',
    })
  );
  if (isAdmin && onRenameCategory) {
    nameContainer.appendChild(
      EditIcon({
        className: 'rename-icon',
        onClick: () =>
          showModal(
            RenameModal({
              name,
              onSubmit: onRenameCategory(name),
            })
          ),
      })
    );
  }

  const searchContainer = Searchbar({
    container,
    onSearch: onTypeSearch,
    onClose: () => renderSongs(songsBlock()),
  });

  searchContainer.appendChild(SearchIcon({}));

  container.append(nameContainer, searchContainer);

  return container;
};

const songsBlock = (songs = getCategory().songs) => {
  const container = Div({ id: 'songs' });

  if (songs.length) {
    songs.forEach(song => {
      const card = Div({
        className: 'card link',
        text: capitalizeFirstLetter(song.name),
        onClick: () => navigate(PAGES.SONG_$(song.id)),
      });
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

const renderCategory = async categoryId => {
  const isAuth = isLoggedIn();
  const isAdmin = isUserAdmin();

  const onDeleteCategory = async id => {
    try {
      await deleteCategoryAPI(id);
      navigate(PAGES.CATEGORIES);
    } catch (e) {
      logError(e);
      Snackbar.displayMsg(e.message);
    }
  };
  const onRenameCategory = name => async e => {
    e.preventDefault();
    const newName = e.target.name.value;

    const { error, value } = validateCategory(newName, name);
    if (error) return Snackbar.displayMsg(error);
    try {
      await renameCategoryAPI(categoryId, value);
      navigate(PAGES.CATEGORY_$(categoryId));
    } catch (e) {
      logError(e);
      Snackbar.displayMsg(e.message);
    }
  };

  try {
    const category = await getCategoryAPI(categoryId);
    if (!category) {
      return;
    }
    setCategory(category);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const { name, songs } = getCategory();

  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.appendChild(
    Button({
      onClick: () => navigate(PAGES.CATEGORIES),
      text: BACK_TO_CATEGORIES,
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_SONG, { categoryId }),
        text: ADD_NEW_SONG,
        color: 'green',
      })
    );
  }
  if (!songs.length && isAdmin) {
    buttons.appendChild(
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

  container.append(
    headerBlock({ isAdmin, name, onRenameCategory }),
    songsBlock(songs),
    buttons
  );

  renderPageWithHeader(container);
};

const renderAllSongs = async () => {
  const isAuth = isLoggedIn();
  const isAdmin = isUserAdmin();
  try {
    const allSongsCategory = await getAllSongs();
    setCategory(allSongsCategory);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const { name } = getCategory();

  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.appendChild(
    Button({
      onClick: () => navigate(PAGES.CATEGORIES),
      text: BACK_TO_CATEGORIES,
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_SONG),
        text: ADD_NEW_SONG,
        color: 'green',
      })
    );
  }

  container.append(headerBlock({ isAdmin, name }), buttons);

  renderPageWithHeader(container);

  renderSongs(songsBlock());
};

export default async () => {
  const categoryId = window.location.pathname.split('/')[2];

  return categoryId !== 'all' ? renderCategory(categoryId) : renderAllSongs();
};

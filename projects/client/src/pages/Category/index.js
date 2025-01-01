import {
  Button,
  Div,
  Edit,
  Header,
  Header1,
  Paragraph,
  RenameModal,
  Search,
  Searchbar,
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
import {
  capitalizeFirstLetter,
  logError,
  validateCategory,
} from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { isLoggedIn } from '../../features/auth';
import { showModal } from '../../features/modal';
import { isUserAdmin } from '../../state/user';

const headerBlock = ({ isAdmin, name, onRenameCategory, onSearch }) => {
  const container = Div({ className: 'category-header-container' });
  const nameContainer = Div({ className: 'category-header-container' });
  nameContainer.appendChild(
    Header1({
      text: capitalizeFirstLetter(name),
      className: 'category-header',
    })
  );
  if (isAdmin) {
    nameContainer.appendChild(
      Edit({
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
    onSearch,
  });

  searchContainer.appendChild(Search({}));

  container.append(nameContainer, searchContainer);

  return container;
};

const songsBlock = songs => {
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
        text: 'Поки пісень для даної категорії немає',
      })
    );
  }

  return container;
};

export default async () => {
  const isAuth = isLoggedIn();
  const isAdmin = isUserAdmin();
  const categoryId = window.location.pathname.split('/')[2];

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

    const validationErr = validateCategory(newName, name);
    if (validationErr) return Snackbar.displayMsg(validationErr);
    try {
      await renameCategoryAPI(categoryId, { name: newName });
      navigate(PAGES.CATEGORY_$(categoryId));
    } catch (e) {
      logError(e);
      Snackbar.displayMsg(e.message);
    }
  };
  const onTypeSearch = e => {
    const value = e.target.value.toLowerCase().trim();
    const { songs } = getCategory();
    if (!songs.length) {
      return;
    }
    const filteredSongs = songs.filter(song =>
      song.name.toLowerCase().includes(value)
    );

    document.getElementById('songs').remove();
    document
      .querySelector('.category-header-container')
      .after(songsBlock(filteredSongs));
  };

  try {
    const category = await getCategoryAPI(categoryId);
    if (!category) {
      return;
    }
    setCategory(category);
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
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
      text: 'До списку категорій',
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_SONG, { categoryId }),
        text: 'Додати пісню',
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
              question: 'Ви впевнені, що хочете видалити категорію?',
              inverseColors: true,
            })
          ),
        text: 'Видалити категорію',
        color: 'red',
      })
    );
  }

  container.append(
    headerBlock({ isAdmin, name, onRenameCategory, onSearch: onTypeSearch }),
    songsBlock(songs),
    buttons
  );

  document.getElementById('root').append(Header(), container);
};

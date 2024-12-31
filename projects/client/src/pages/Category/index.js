import {
  Button,
  Div,
  Edit,
  Header,
  Header1,
  Paragraph,
  RenameModal,
  SubmitModal,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import {
  getCategory as getCategoryAPI,
  deleteCategory as deleteCategoryAPI,
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

const songsBlock = songs => {
  const container = Div({ id: 'songs' });

  if (songs.length) {
    songs.forEach(song => {
      const card = Div({
        className: 'card link',
        text: song.name,
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

// todo here!!!
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
  // const onTypeSearch = e => {
  //   e.preventDefault();
  //   const searchValue = e.target.value.toLowerCase();
  //   const songs = document.querySelectorAll('.song');
  //
  // };

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

  // const headingContainer = Div({
  //
  // });

  const header = Header1({
    text: capitalizeFirstLetter(name),
  });
  if (isAdmin) {
    header.appendChild(
      Edit({
        color: 'var(--black)',
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

  container.append(header, songsBlock(songs), buttons);

  document.getElementById('root').append(Header(), container);
};

// todo
// eslint-disable-next-line no-unused-vars
const search = () => {
  const searchField = document.querySelector('#search');
  const songsContainer = document.querySelector('.songs');
  const songs = document.querySelectorAll('.song');
  const makeSongsContainer = song => {
    const songCard = document.createElement('div');
    songCard.classList.add('card');
    songCard.append(song);

    return songCard;
  };
  if (searchField) {
    searchField.addEventListener('input', () => {
      if (songs.length) {
        const searchValue = searchField.value.toLowerCase();
        const filteredSongs = [];
        songs.forEach(song => {
          if (song.text.toLowerCase().includes(searchValue)) {
            filteredSongs.push(song);
          }
        });
        if (!filteredSongs.length) {
          songsContainer.innerHTML = 'Пісень не знайдено';
        } else if (!searchValue.length) {
          songsContainer.innerHTML = '';
          songs.forEach(song => {
            const songCard = makeSongsContainer(song);
            songsContainer.appendChild(songCard);
          });
        } else {
          songsContainer.innerHTML = '';
          filteredSongs.forEach(song => {
            const songCard = makeSongsContainer(song);
            songsContainer.appendChild(songCard);
          });
        }
      }
    });
  }
};

import {
  Button,
  Div,
  Header,
  Header1,
  Paragraph,
  SubmitModal,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import {
  getCategory as getCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from '../../api/category';
import { getCategory, setCategory } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { isLoggedIn } from '../../features/auth';
import { showModal } from '../../features/modal';

export default async () => {
  const isAuth = isLoggedIn();
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

  const category = getCategory();
  const songs = category.songs;

  const container = Div({
    className: 'container',
  });

  const header = Header1({
    text: capitalizeFirstLetter(category.name),
  });

  const songsBlock = Div();

  if (songs.length) {
    songs.forEach(song => {
      const card = Div({
        className: 'card link',
        text: song.name,
        onClick: () => navigate(PAGES.SONG_$(song.id)),
      });
      songsBlock.appendChild(card);
    });
  } else {
    songsBlock.append(
      Paragraph({
        text: 'Поки пісень для даної категорії немає',
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
    if (!songs.length) {
      buttons.appendChild(
        Button({
          onClick: () =>
            showModal(
              SubmitModal({
                onConfirm: () => onDeleteCategory(categoryId),
                question: 'Ви впевнені, що хочете видалити категорію?',
              })
            ),
          text: 'Видалити категорію',
          color: 'red',
        })
      );
    }
  }

  container.append(header, songsBlock, buttons);

  document.getElementById('root').append(Header(), container);
};

import {
  Button,
  Div,
  Header1,
  Paragraph,
  Pre,
  Span,
  SubmitModal,
} from '../../components';
import { navigate, navigateBack } from '../../utils/navigate';
import { PAGES } from '../../constants';
import { ADDED_BY, DELETE, DELETE_SONG_QUESTION, EDIT } from './messages';
import { BACK, BACK_TO_CATEGORIES } from '../../constants/messages';
import {
  deleteSong as deleteSongAPI,
  getSong as getSongAPI,
} from '../../api/song';
import { getCategories as getCategoriesAPI } from '../../api/category.js';
import { getCategories, getSong, setCategories, setSong } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { showModal } from '../../features/modal';
import { isUserAdmin } from '../../state/user';
import { renderPageWithHeader } from '../../utils/dom';

const getHeaderBlock = (name, author) => {
  const container = Div({ className: 'category-header-container' });
  container.appendChild(
    Header1({
      text: name,
      className: 'category-header',
    })
  );
  if (author) {
    container.appendChild(
      Paragraph({
        text: author,
        className: 'song-author',
      })
    );
  }

  return container;
};

const getCategoriesBlock = songCategories => {
  const allCategories = getCategories();

  const container = Div({
    className: 'category-tags',
  });
  songCategories.forEach(categoryId => {
    const category = allCategories.find(cat => cat.id === categoryId);
    if (category) {
      container.appendChild(
        Span({
          className: 'category-tag',
          text: category.name.toUpperCase(),
        })
      );
    }
  });
  return container;
};

export default async () => {
  const songId = window.location.pathname.split('/')[2];
  const isAdmin = isUserAdmin();

  const onDeleteSong = async () => {
    try {
      await deleteSongAPI(songId);
      if (history.length > 2) {
        navigateBack();
      } else {
        navigate(PAGES.CATEGORIES);
      }
    } catch (e) {
      logError(e);
      Snackbar.displayMsg(e.message);
    }
  };

  try {
    const categories = await getCategoriesAPI();
    setCategories(categories);
    const song = await getSongAPI(songId);
    if (!song) {
      return;
    }
    setSong(song);
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }

  const { name, text, author, isOwner, owner, categories } = getSong();

  const songName = capitalizeFirstLetter(name);

  const container = Div({
    className: 'container',
  });

  container.append(
    getHeaderBlock(songName, capitalizeFirstLetter(author)),
    Pre({ text }),
    getCategoriesBlock(categories)
  );

  if (owner) {
    const authorBlock = Paragraph({
      className: 'right',
      text: ADDED_BY,
    });
    authorBlock.appendChild(Span({ className: 'bold', text: owner }));
    container.appendChild(authorBlock);
  }

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: () => {
        if (history.length > 2) {
          navigateBack();
        } else {
          navigate(PAGES.CATEGORIES);
        }
      },
      text: BACK,
      color: 'blue',
    }),
    Button({
      onClick: () => navigate(PAGES.CATEGORIES),
      text: BACK_TO_CATEGORIES,
      color: 'blue',
    })
  );

  if (isOwner || isAdmin) {
    buttons.append(
      Button({
        onClick: () => navigate(PAGES.EDIT_SONG_$(songId)),
        text: EDIT,
        color: 'green',
      }),
      Button({
        onClick: () =>
          showModal(
            SubmitModal({
              onConfirm: onDeleteSong,
              question: DELETE_SONG_QUESTION,
              inverseColors: true,
            })
          ),
        text: DELETE,
        color: 'red',
      })
    );
  }

  container.appendChild(buttons);

  renderPageWithHeader(songName, container);
};

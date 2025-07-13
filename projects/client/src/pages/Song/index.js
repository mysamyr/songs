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
import {
  deleteSong as deleteSongAPI,
  getSong as getSongAPI,
} from '../../api/song';
import { getSong, setSong } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { showModal } from '../../features/modal';
import { isUserAdmin } from '../../state/user';
import { ADDED_BY, DELETE, DELETE_SONG_QUESTION, EDIT } from './messages';
import { BACK, BACK_TO_CATEGORIES } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';

export default async () => {
  const songId = window.location.pathname.split('/')[2];
  const isAdmin = isUserAdmin();

  const onDeleteSong = async id => {
    try {
      await deleteSongAPI(id);
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
    const song = await getSongAPI(songId);
    if (!song) {
      return;
    }
    setSong(song);
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }

  const song = getSong();

  const container = Div({
    className: 'container',
  });

  container.append(
    Header1({
      text: capitalizeFirstLetter(song.name),
      className: 'category-header',
    }),
    Pre({
      text: song.text,
    })
  );

  if (song.isAuthor) {
    const author = Paragraph({
      className: 'right',
      text: ADDED_BY,
    });
    author.appendChild(Span({ className: 'bold', text: song.author }));
    container.appendChild(author);
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

  if (song.isAuthor || isAdmin) {
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
              onConfirm: () => onDeleteSong(songId),
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

  renderPageWithHeader(container);
};

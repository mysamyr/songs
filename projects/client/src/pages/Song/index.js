import {
  Button,
  Div,
  Header,
  Header1,
  Paragraph,
  Pre,
  SubmitModal,
} from '../../components';
import { navigate, navigateBack } from '../../utils/navigate';
import { PAGES } from '../../constants';
import {
  getSong as getSongAPI,
  deleteSong as deleteSongAPI,
} from '../../api/song';
import { getSong, setSong } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { showModal } from '../../features/modal';
import { isUserAdmin } from '../../state/user';

export default async () => {
  const songId = window.location.pathname.split('/')[2];
  const isAdmin = isUserAdmin();

  const onDeleteSong = async id => {
    try {
      await deleteSongAPI(id);
      navigate(PAGES.CATEGORIES);
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
    }),
    Pre({
      text: song.text,
    })
  );

  if (song.isAuthor) {
    container.appendChild(Paragraph({ className: 'right', text: song.author }));
  }

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: () => navigateBack(),
      text: 'Назад',
      color: 'blue',
    }),
    Button({
      onClick: () => navigate(PAGES.CATEGORIES),
      text: 'До списку категорій',
      color: 'blue',
    })
  );

  if (song.isAuthor || isAdmin) {
    buttons.append(
      Button({
        onClick: () => navigate(PAGES.EDIT_SONG_$(songId)),
        text: 'Редагувати',
        color: 'blue',
      }),
      Button({
        onClick: () =>
          showModal(
            SubmitModal({
              onConfirm: () => onDeleteSong(songId),
              question: 'Ви впевнені, що хочете видалити пісню?',
            })
          ),
        text: 'Видалити',
        color: 'red',
      })
    );
  }

  container.appendChild(buttons);

  document.getElementById('root').append(Header(), container);
};

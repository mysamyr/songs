import {
  Button,
  Div,
  Header1,
  Paragraph,
  Searchbar,
  SearchIcon,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import { getCategory, setCategory } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { isLoggedIn } from '../../features/auth';
import { ADD_NEW_SONG, NO_SONGS, TITLE } from './messages';
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

const headerBlock = () => {
  const container = Div({ className: 'category-header-container' });
  const nameContainer = Div({ className: 'category-header-container' });
  nameContainer.appendChild(
    Header1({
      text: TITLE,
      className: 'category-header',
    })
  );

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

const buttonsBlock = (isAuth = isLoggedIn()) => {
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
        onClick: () => navigate(PAGES.NEW_SONG),
        text: ADD_NEW_SONG,
        color: 'green',
      })
    );
  }
  return container;
};

export default async () => {
  try {
    const allSongsCategory = await getAllSongs();
    setCategory(allSongsCategory);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const container = Div({
    className: 'container',
  });

  container.append(headerBlock(), songsBlock(), buttonsBlock());

  renderPageWithHeader(TITLE, container);
};

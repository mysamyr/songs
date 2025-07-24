import { Button, Div, Header1, Paragraph, Searchbar } from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES, PAGINATION_LIMIT } from '../../constants';
import { getCategory, setCategory } from '../../state';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import { isLoggedIn } from '../../features/auth';
import { ADD_NEW_SONG, NO_SONGS, TITLE } from './messages';
import { BACK_TO_CATEGORIES } from '../../constants/messages';
import { getAllSongs } from '../../api/song';
import { renderPageWithHeader } from '../../utils/dom';
import {
  getQueryParam,
  getURLWithQueryParams,
} from '../../utils/query-params';

const onTypeSearch = searchValue => {
  const search = getQueryParam('search');
  const value = searchValue.toLowerCase().trim();

  if (value === search) {
    return;
  }

  return navigate(getURLWithQueryParams(PAGES.ALL_SONGS, { search: value }));
};

const addSongs = list => {
  document.getElementById('songs').append(...list);
};

const getSongCard = song =>
  Div({
    className: 'card link',
    text: `${capitalizeFirstLetter(song.name)}${song.author ? ` - ${capitalizeFirstLetter(song.author)}` : ''}`,
    onClick: () => navigate(PAGES.SONG_$(song.id)),
  });

const loadMoreSongs = async () => {
  const originalCategory = getCategory();

  try {
    const { songs } = await getAllSongs({
      skip: originalCategory.songs.length,
      limit: PAGINATION_LIMIT,
    });

    if (!songs.length) {
      document.getElementById('more-btn').remove();
      return;
    }

    if (songs.length < PAGINATION_LIMIT) {
      document.getElementById('more-btn').remove();
    }

    setCategory({
      ...originalCategory,
      songs: [...originalCategory.songs, ...songs],
    });
    addSongs(songs.map(getSongCard));
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
  }
};

const headerBlock = value => {
  const container = Div({ className: 'category-header-container' });

  const searchContainer = Searchbar({
    value,
    onSearch: onTypeSearch,
  });

  container.append(
    Header1({
      text: TITLE,
      className: 'category-header',
    }),
    searchContainer
  );

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
  const search = getQueryParam('search');

  try {
    const allSongsCategory = await getAllSongs({
      search,
      skip: 0,
      limit: PAGINATION_LIMIT,
    });
    setCategory(allSongsCategory);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const container = Div({
    className: 'container',
  });

  container.append(
    headerBlock(search),
    songsBlock(),
    loadMoreBtn(),
    buttonsBlock()
  );

  renderPageWithHeader(TITLE, container);
};

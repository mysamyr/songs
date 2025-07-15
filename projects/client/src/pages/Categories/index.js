import { PAGES, PAGINATION_LIMIT } from '../../constants';
import { Button, Div, Header1, Paragraph } from '../../components';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { isLoggedIn } from '../../features/auth';
import Snackbar from '../../features/snackbar';
import { getCategories, setCategories } from '../../state';
import { navigate } from '../../utils/navigate';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';
import {
  ADD_NEW_CATEGORY,
  ADD_NEW_SONG,
  HEADER,
  NO_CATEGORIES,
  TITLE,
} from './messages';
import { BACK_HOME } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';

const addCategories = list => {
  document.getElementById('categories').append(...list);
};

const getCategoryCard = category =>
  Div({
    className: 'card link',
    text: capitalizeFirstLetter(category.name),
    onClick: () => navigate(PAGES.CATEGORY_$(category.id)),
  });

const loadMoreCategories = async () => {
  const originCategories = getCategories();
  try {
    const categories = await getCategoriesAPI({
      skip: originCategories.length,
      limit: PAGINATION_LIMIT,
    });

    if (!categories.length) {
      document.getElementById('more-btn').remove();
      return;
    }

    if (categories.length < PAGINATION_LIMIT) {
      document.getElementById('more-btn').remove();
    }
    setCategories([...originCategories, ...categories]);
    addCategories(categories.map(getCategoryCard));
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
  }
};

const headerBlock = () => {
  const container = Div({ className: 'category-header-container' });

  container.appendChild(
    Header1({
      text: HEADER,
      className: 'category-header',
    })
  );

  return container;
};

const categoriesBlock = (categories = getCategories()) => {
  const container = Div({
    id: 'categories',
  });

  container.appendChild(
    Div({
      className: 'card active link',
      text: capitalizeFirstLetter('Всі пісні'),
      onClick: () => navigate(PAGES.CATEGORY_$('all')),
    })
  );

  if (categories.length) {
    categories.forEach(category => {
      const card = getCategoryCard(category);
      container.appendChild(card);
    });
  } else {
    container.append(
      Paragraph({
        text: NO_CATEGORIES,
      })
    );
  }

  return container;
};

const loadMoreBtn = (categories = getCategories()) => {
  const container = Div({
    className: 'btns',
  });

  if (categories.length === PAGINATION_LIMIT) {
    container.append(
      Div({
        id: 'more-btn',
        text: 'Показати більше',
        onClick: loadMoreCategories,
      })
    );
  }

  return container;
};

const buttonsBlock = (isAuth = isLoggedIn(), categories = getCategories()) => {
  const container = Div({
    className: 'btns',
  });

  container.append(
    Button({
      onClick: () => navigate(PAGES.HOME),
      text: BACK_HOME,
      color: 'blue',
    })
  );
  if (isAuth) {
    container.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_CATEGORY),
        text: ADD_NEW_CATEGORY,
        color: 'green',
      })
    );
    if (categories.length) {
      container.appendChild(
        Button({
          onClick: () => navigate(PAGES.NEW_SONG),
          text: ADD_NEW_SONG,
          color: 'green',
        })
      );
    }
  }

  return container;
};

export default async () => {
  try {
    const categories = await getCategoriesAPI({
      skip: 0,
      limit: PAGINATION_LIMIT,
    });
    setCategories(categories);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const container = Div({
    className: 'container',
  });

  container.append(
    headerBlock(),
    categoriesBlock(),
    loadMoreBtn(),
    buttonsBlock()
  );

  renderPageWithHeader(TITLE, container);
};

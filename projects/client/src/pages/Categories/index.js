import { PAGES } from '../../constants';
import {
  Button,
  Div,
  Header1,
  Paragraph,
  Searchbar,
  SearchIcon,
} from '../../components';
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

const onTypeSearch = e => {
  const value = e.target.value.toLowerCase().trim();
  const categories = getCategories();

  if (!categories.length) {
    return;
  }
  const filteredCategories = categories.filter(category =>
    category.name.includes(value)
  );

  renderCategories(categoriesBlock(filteredCategories));
};

const renderCategories = list => {
  document.getElementById('categories')?.remove();
  document.querySelector('.category-header-container').after(list);
};

const headerBlock = onSearch => {
  const container = Div({ className: 'category-header-container' });

  const searchContainer = Searchbar({
    container,
    onSearch,
    onClose: () => renderCategories(categoriesBlock()),
  });

  searchContainer.appendChild(SearchIcon({}));

  container.append(
    Header1({
      text: HEADER,
      className: 'category-header',
    }),
    searchContainer
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
      const card = Div({
        className: 'card link',
        text: capitalizeFirstLetter(category.name),
        onClick: () => navigate(PAGES.CATEGORY_$(category.id)),
      });
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

export default async () => {
  const isAuth = isLoggedIn();

  try {
    const categories = await getCategoriesAPI();
    if (!categories) {
      return;
    }
    setCategories(categories);
  } catch (e) {
    logError(e);
    Snackbar.displayMsg(e.message);
    return navigate(PAGES.HOME);
  }

  const categories = getCategories();

  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: () => navigate(PAGES.HOME),
      text: BACK_HOME,
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_CATEGORY),
        text: ADD_NEW_CATEGORY,
        color: 'green',
      })
    );
    if (categories.length) {
      buttons.appendChild(
        Button({
          onClick: () => navigate(PAGES.NEW_SONG),
          text: ADD_NEW_SONG,
          color: 'green',
        })
      );
    }
  }

  container.append(headerBlock(onTypeSearch), buttons);

  renderPageWithHeader(TITLE, container);
  renderCategories(categoriesBlock());
};

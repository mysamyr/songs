import { PAGES } from '../../constants';
import {
  Button,
  Div,
  Header,
  Header1,
  Paragraph,
  Search,
  Searchbar,
} from '../../components';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { isLoggedIn } from '../../features/auth';
import Snackbar from '../../features/snackbar';
import { getCategories, setCategories } from '../../state';
import { navigate } from '../../utils/navigate';
import { capitalizeFirstLetter, logError } from '../../utils/helpers';

const headerBlock = onSearch => {
  const container = Div({ className: 'category-header-container' });

  const searchContainer = Searchbar({
    container,
    onSearch,
  });

  searchContainer.appendChild(Search({}));

  container.append(
    Header1({
      text: 'Категорії',
      className: 'category-header',
    }),
    searchContainer
  );

  return container;
};

const categoriesBlock = categories => {
  const container = Div({
    id: 'categories',
  });

  if (categories.length) {
    categories.forEach(category => {
      const card = Div({
        className: 'card link',
        text: capitalizeFirstLetter(category.name),
        onClick: () => {
          navigate(PAGES.CATEGORY_$(category.id));
        },
      });
      container.appendChild(card);
    });
  } else {
    container.append(
      Paragraph({
        text: 'Категорій немає',
      })
    );
  }

  return container;
};

export default async () => {
  const isAuth = isLoggedIn();
  const onTypeSearch = e => {
    const value = e.target.value.toLowerCase().trim();
    const categories = getCategories();

    if (!categories.length) {
      return;
    }
    const filteredCategories = categories.filter(category =>
      category.name.includes(value)
    );

    document.getElementById('categories').remove();
    document
      .querySelector('.category-header-container')
      .after(categoriesBlock(filteredCategories));
  };

  try {
    const categories = await getCategoriesAPI();
    if (!categories) {
      return;
    }
    setCategories(categories);
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
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
      text: 'На головну',
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.appendChild(
      Button({
        onClick: () => navigate(PAGES.NEW_CATEGORY),
        text: 'Додати категорію',
        color: 'green',
      })
    );
    if (categories.length) {
      buttons.appendChild(
        Button({
          onClick: () => navigate(PAGES.NEW_SONG),
          text: 'Додати пісню',
          color: 'green',
        })
      );
    }
  }

  container.append(
    headerBlock(onTypeSearch),
    categoriesBlock(categories),
    buttons
  );

  document.getElementById('root').append(Header(), container);
};

import { Button, Div, Header, Header1, Paragraph } from '../../components';
import { isLoggedIn } from '../../features/auth';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { getCategories, setCategories } from '../../state';
import { logError } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';

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
    return Snackbar.displayMsg(e.message);
  }

  const categories = getCategories();

  const container = Div({
    className: 'container',
  });

  const header = Header1({
    text: 'Категорії',
  });

  const categoriesBlock = Div();

  if (categories.length) {
    categories.forEach(category => {
      const card = Div({
        className: 'card link',
        text: category.name,
        onClick: () => {
          navigate(PAGES.CATEGORY_$(category.id));
        },
      });
      categoriesBlock.appendChild(card);
    });
  } else {
    categoriesBlock.append(
      Paragraph({
        text: 'Категорій ще немає',
      })
    );
  }

  const buttons = Div({
    className: 'buttons_container',
  });
  buttons.append(
    Button({
      onClick: () => navigate(PAGES.HOME),
      text: 'На головну',
      color: 'blue',
    })
  );
  if (isAuth) {
    buttons.append(
      Button({
        onClick: () => navigate(PAGES.NEW_CATEGORY),
        text: 'Додати категорію',
        color: 'green',
      }),
      Button({
        onClick: () => navigate(PAGES.NEW_SONG),
        text: 'Додати пісню',
        color: 'green',
      })
    );
  }

  container.append(header, categoriesBlock, buttons);

  document.getElementById('root').append(Header(), container);
};

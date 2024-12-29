import {
  Button,
  Div,
  Form,
  Header,
  Header1,
  Input,
  Label,
  Span,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { CATEGORY, PAGES } from '../../constants';
import { createCategory } from '../../api/category';
import Snackbar from '../../features/snackbar';

export default async () => {
  const onAddNewCategory = async e => {
    e.preventDefault();
    const name = e.target.name.value;

    if (!name.length) {
      return Snackbar.displayMsg('Назва категорії не може бути порожньою');
    }

    if (name.length < CATEGORY.MIN) {
      return Snackbar.displayMsg(
        `Назва категорії має містити мінімум ${CATEGORY.MIN} символів`
      );
    }

    if (name.length > CATEGORY.MAX) {
      return Snackbar.displayMsg(
        `Назва категорії має містити максимум ${CATEGORY.MAX} символів`
      );
    }

    try {
      await createCategory({ name });
      Snackbar.displayMsg('Категорію успішно додано');
      navigate(PAGES.CATEGORIES);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  const container = Div({
    className: 'container',
  });

  const header = Header1({
    text: 'Додати нову категорію',
  });

  const form = Form({
    className: 'tab_content',
    onSubmit: onAddNewCategory,
  });

  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: 'Назва категорії:',
    }),
    Input({
      type: 'text',
      name: 'name',
      min: CATEGORY.MIN,
      max: CATEGORY.MAX,
      focus: true,
      required: true,
    })
  );

  const buttonContainer = Div({
    className: 'buttons_container',
  });
  buttonContainer.append(
    Button({
      text: 'Додати категорію',
      type: 'submit',
    }),
    Button({
      text: 'Назад до категорій',
      color: 'blue',
      onClick: () => navigate(PAGES.CATEGORIES),
    })
  );

  form.append(nameLabel, buttonContainer);

  container.append(header, form);

  document.getElementById('root').append(Header(), container);
};

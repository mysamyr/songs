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
import { validateCategory } from '../../utils/helpers';

const nameInput = () => {
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
  return nameLabel;
};

export default async () => {
  const onAddNewCategory = async e => {
    e.preventDefault();
    const name = e.target.name.value;

    const errors = validateCategory(name);
    if (errors) return Snackbar.displayMsg(errors);

    try {
      await createCategory({ name });
      Snackbar.displayMsg(`Категорію ${name} додано`);
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
    className: 'tab-content',
    onSubmit: onAddNewCategory,
  });

  const buttonContainer = Div({
    className: 'btns',
  });
  buttonContainer.append(
    Button({
      text: 'Додати категорію',
      type: 'submit',
      color: 'green',
    }),
    Button({
      text: 'Назад до категорій',
      color: 'blue',
      onClick: () => navigate(PAGES.CATEGORIES),
    })
  );

  form.append(nameInput(), buttonContainer);

  container.append(header, form);

  document.getElementById('root').append(Header(), container);
};

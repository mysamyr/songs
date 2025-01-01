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
import {
  ADD_NEW_CATEGORY,
  BACK_TO_CATEGORIES,
  CATEGORY_ADDED_$,
  CATEGORY_HEADER,
  HEADER,
} from './messages';

const nameInput = () => {
  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: CATEGORY_HEADER,
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
      Snackbar.displayMsg(CATEGORY_ADDED_$);
      navigate(PAGES.CATEGORIES);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  const container = Div({
    className: 'container',
  });

  const header = Header1({
    text: HEADER,
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
      text: ADD_NEW_CATEGORY,
      type: 'submit',
      color: 'green',
    }),
    Button({
      text: BACK_TO_CATEGORIES,
      color: 'blue',
      onClick: () => navigate(PAGES.CATEGORIES),
    })
  );

  form.append(nameInput(), buttonContainer);

  container.append(header, form);

  document.getElementById('root').append(Header(), container);
};

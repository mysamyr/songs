import {
  ADD_NEW_CATEGORY,
  CATEGORY_ADDED_$,
  CATEGORY_HEADER,
  HEADER,
} from './messages';
import { BACK_TO_CATEGORIES } from '../../constants/messages';
import {
  Button,
  Div,
  Form,
  Header1,
  Input,
  Label,
  Span,
} from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import { CATEGORY } from '../../constants/validation';
import { createCategory } from '../../api/category';
import Snackbar from '../../features/snackbar';
import { validateCategory } from '../../utils/validation';
import { renderPageWithHeader } from '../../utils/dom';

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

const onAddNewCategory = async e => {
  e.preventDefault();
  const name = e.target.name.value.toLowerCase();

  const { error, value } = validateCategory(name);
  if (error) return Snackbar.displayMsg(error);

  try {
    await createCategory(value);
    Snackbar.displayMsg(CATEGORY_ADDED_$);
    navigate(PAGES.CATEGORIES);
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }
};

export default async () => {
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

  renderPageWithHeader(container);
};

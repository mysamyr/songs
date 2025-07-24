import { PAGES } from '../../constants';
import { SONG_NAME, SONG_TEXT } from '../../constants/validation';
import {
  Button,
  Div,
  Form,
  Header1,
  Input,
  Label,
  Option,
  Select,
  Span,
  Textarea,
} from '../../components';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { createSong } from '../../api/song';
import Snackbar from '../../features/snackbar';
import { getCategories, setCategories } from '../../state';
import { navigate, navigateBack } from '../../utils/navigate';
import { validateSong } from '../../utils/validation';
import {
  ADD_NEW_SONG,
  CHOOSE_CATEGORIES,
  CREATE_CATEGORY,
  HEADER,
  NO_CATEGORIES,
  SONG_ADDED_$,
  SONG_AUTHOR_HEADER,
  SONG_NAME_HEADER,
  SONG_TEXT_HEADER,
  TITLE,
} from './messages';
import { BACK } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';

const categorySelect = activeCategory => {
  const categories = getCategories();

  if (!categories.length) {
    const container = Div({});
    container.append(
      Span({ text: NO_CATEGORIES }),
      Span({
        text: ' ' + CREATE_CATEGORY,
        className: 'link',
        onClick: () => navigate(PAGES.NEW_CATEGORY),
      })
    );
    return container;
  }
  const container = Label({
    className: 'input-field',
  });
  const select = Select({
    name: 'categories',
    required: true,
    multiple: true,
  });

  categories.forEach(category => {
    select.append(
      Option({
        value: category.id,
        text: category.name,
        selected: category.id === activeCategory,
      })
    );
  });

  container.append(
    Span({
      text: CHOOSE_CATEGORIES,
    }),
    select
  );

  return container;
};

const nameInput = () => {
  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: SONG_NAME_HEADER,
    }),
    Input({
      type: 'text',
      name: 'name',
      min: SONG_NAME.MIN,
      max: SONG_NAME.MAX,
      required: true,
    })
  );
  return nameLabel;
};

const authorInput = () => {
  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: SONG_AUTHOR_HEADER,
    }),
    Input({
      type: 'text',
      name: 'author',
      max: SONG_NAME.MAX,
    })
  );
  return nameLabel;
};

const textAreaInput = () => {
  const textLabel = Label({
    className: 'input-field',
  });
  textLabel.append(
    Span({
      text: SONG_TEXT_HEADER,
    }),
    Textarea({
      name: 'text',
      min: SONG_TEXT.MIN,
      max: SONG_TEXT.MAX,
      required: true,
    })
  );
  return textLabel;
};

export default async () => {
  const { categoryId } = window.history.state;
  const onAddNewSong = async e => {
    e.preventDefault();
    const categories = [...e.target.categories.options]
      .filter(option => option.selected)
      .map(option => option.value);
    const name = e.target.name.value;
    const author = e.target.author.value;
    const text = e.target.text.value;

    const { error, value } = validateSong(categories, name, author, text);
    if (error) return Snackbar.displayMsg(error);

    try {
      const { id } = await createSong(value);
      Snackbar.displayMsg(SONG_ADDED_$(name));
      if (history.length > 2) {
        navigateBack();
      } else {
        navigate(PAGES.SONG_$(id));
      }
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  try {
    const categories = await getCategoriesAPI();
    setCategories(categories);
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }

  const container = Div({
    className: 'container',
  });

  const form = Form({
    className: 'tab-content',
    onSubmit: onAddNewSong,
  });

  const buttonContainer = Div({
    className: 'btns',
  });
  buttonContainer.append(
    Button({
      text: BACK,
      color: 'blue',
      onClick: () => {
        if (history.length > 2) {
          navigateBack();
        } else {
          navigate(PAGES.CATEGORIES);
        }
      },
    }),
    Button({
      text: ADD_NEW_SONG,
      type: 'submit',
      color: 'green',
    })
  );

  form.append(
    categorySelect(categoryId),
    nameInput(),
    authorInput(),
    textAreaInput(),
    buttonContainer
  );

  container.append(
    Header1({
      text: HEADER,
    }),
    form
  );

  renderPageWithHeader(TITLE, container);
};

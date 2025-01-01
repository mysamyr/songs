import { PAGES, SONG, SONG_TEXT } from '../../constants';
import {
  Button,
  Div,
  Form,
  Header,
  Header1,
  Input,
  Label,
  Span,
  Select,
  Option,
} from '../../components';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { createSong } from '../../api/song';
import Snackbar from '../../features/snackbar';
import { getCategories, setCategories } from '../../state';
import { navigate, navigateBack } from '../../utils/navigate';
import { validateSong } from '../../utils/helpers';
import {
  ADD_NEW_SONG,
  CHOOSE_CATEGORIES,
  HEADER,
  NO_CATEGORIES,
  SONG_ADDED_$,
  SONG_NAME_HEADER,
  SONG_TEXT_HEADER,
} from './messages';
import { BACK } from '../../constants/messages';

const categorySelect = activeCategory => {
  const categories = getCategories();

  if (!categories.length) {
    return Div({
      text: NO_CATEGORIES,
    });
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
      min: SONG.MIN,
      max: SONG.MAX,
      required: true,
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
    Input({
      type: 'textarea',
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
    const text = e.target.text.value;

    const validationErr = validateSong(categories, name, text);
    if (validationErr) return Snackbar.displayMsg(validationErr);

    try {
      const { id } = await createSong({ categories, name, text });
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

  // todo handle error ???
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
    textAreaInput(),
    buttonContainer
  );

  container.append(
    Header1({
      text: HEADER,
    }),
    form
  );

  document.getElementById('root').append(Header(), container);
};

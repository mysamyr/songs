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

const categorySelect = () => {
  const categories = getCategories();

  if (!categories.length) {
    return Div({
      text: 'Немає категорій',
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
      })
    );
  });

  container.append(
    Span({
      text: 'Виберіть категорії:',
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
      text: 'Назва пісні:',
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
      text: 'Текст пісні:',
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
      Snackbar.displayMsg('Пісню додано');
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
      text: 'Назад',
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
      text: 'Додати пісню',
      type: 'submit',
      color: 'green',
    })
  );

  form.append(categorySelect(), nameInput(), textAreaInput(), buttonContainer);

  container.append(
    Header1({
      text: 'Додати нову пісню',
    }),
    form
  );

  document.getElementById('root').append(Header(), container);
};

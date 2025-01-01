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
  Textarea,
  Option,
} from '../../components';
import { getCategories as getCategoriesAPI } from '../../api/category';
import { editSong, getSong as getSongAPI } from '../../api/song';
import Snackbar from '../../features/snackbar';
import { getCategories, getSong, setCategories, setSong } from '../../state';
import { navigate, navigateBack } from '../../utils/navigate';
import { validateSong } from '../../utils/helpers';

const categorySelect = selectedCategories => {
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
    select.appendChild(
      Option({
        value: category.id,
        text: category.name,
        selected: selectedCategories.includes(category.id),
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

const nameInput = name => {
  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: 'Назва пісні:',
    }),
    Input({
      value: name,
      type: 'text',
      name: 'name',
      min: SONG.MIN,
      max: SONG.MAX,
      required: true,
    })
  );
  return nameLabel;
};

const textAreaInput = text => {
  const textLabel = Label({
    className: 'input-field',
  });
  textLabel.append(
    Span({
      text: 'Текст пісні:',
    }),
    Textarea({
      value: text,
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
  const songId = window.location.pathname.split('/')[2];
  const onEditSong = async e => {
    e.preventDefault();
    const categories = [...e.target.categories.options]
      .filter(option => option.selected)
      .map(option => option.value);
    const name = e.target.name.value;
    const text = e.target.text.value;

    const validationErr = validateSong(categories, name, text);
    if (validationErr) return Snackbar.displayMsg(validationErr);

    try {
      await editSong(songId, { categories, name, text });
      Snackbar.displayMsg('Пісню змінено');
      if (history.length > 2) {
        navigateBack();
      } else {
        navigate(PAGES.SONG_$(songId));
      }
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  // todo handle error ???
  try {
    const song = await getSongAPI(songId);
    setSong(song);
    const categories = await getCategoriesAPI();
    setCategories(categories);
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }

  const song = getSong();

  const container = Div({
    className: 'container',
  });

  const form = Form({
    className: 'tab-content',
    onSubmit: onEditSong,
  });

  const buttonContainer = Div({
    className: 'btns',
  });
  buttonContainer.append(
    Button({
      text: 'Зберегти',
      type: 'submit',
      color: 'green',
    }),
    Button({
      text: 'Назад',
      color: 'blue',
      onClick: () => {
        if (history.length > 2) {
          navigateBack();
        } else {
          navigate(PAGES.SONG_$(songId));
        }
      },
    })
  );

  form.append(
    categorySelect(song.categories),
    nameInput(song.name),
    textAreaInput(song.text),
    buttonContainer
  );

  container.append(
    Header1({
      text: 'Редагувати пісню',
    }),
    form
  );

  document.getElementById('root').append(Header(), container);
};

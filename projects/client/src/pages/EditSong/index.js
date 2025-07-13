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
import { editSong, getSong as getSongAPI } from '../../api/song';
import Snackbar from '../../features/snackbar';
import { getCategories, getSong, setCategories, setSong } from '../../state';
import { navigate, navigateBack } from '../../utils/navigate';
import { validateSong } from '../../utils/validation';
import {
  CHOOSE_CATEGORIES,
  HEADER,
  NO_CATEGORIES,
  SAVE,
  SONG_CHANGED,
  SONG_NAME_HEADER,
  SONG_TEXT_HEADER,
} from './messages';
import { BACK } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';

const categorySelect = selectedCategories => {
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
      text: CHOOSE_CATEGORIES,
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
      text: SONG_NAME_HEADER,
    }),
    Input({
      value: name,
      type: 'text',
      name: 'name',
      min: SONG_NAME.MIN,
      max: SONG_NAME.MAX,
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
      text: SONG_TEXT_HEADER,
    }),
    Textarea({
      value: text,
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

    const { value, error } = validateSong(categories, name, text);
    if (error) return Snackbar.displayMsg(error);

    try {
      await editSong(songId, value);
      Snackbar.displayMsg(SONG_CHANGED);
      if (history.length > 2) {
        navigateBack();
      } else {
        navigate(PAGES.SONG_$(songId));
      }
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

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
      text: SAVE,
      type: 'submit',
      color: 'green',
    }),
    Button({
      text: BACK,
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
      text: HEADER,
    }),
    form
  );

  renderPageWithHeader(container);
};

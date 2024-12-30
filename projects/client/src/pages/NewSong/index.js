import { CATEGORY, PAGES, SONG, SONG_TEXT } from '../../constants';
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
      text: 'Виберіть категорію:',
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
      text: 'Назва категорії:',
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

    if (!name.length || !text.length) {
      return Snackbar.displayMsg("Всі поля є обов'язковими");
    }
    if (!categories.length) {
      return Snackbar.displayMsg('Виберіть щонайменше одну категорію');
    }

    if (name.length < SONG.MIN) {
      return Snackbar.displayMsg(
        `Назва пісні має містити мінімум ${CATEGORY.MIN} символів`
      );
    }
    if (name.length > SONG.MAX) {
      return Snackbar.displayMsg(
        `Назва пісні має містити максимум ${CATEGORY.MAX} символів`
      );
    }

    if (name.length < CATEGORY.MIN) {
      return Snackbar.displayMsg(
        `Текст пісні має містити мінімум ${CATEGORY.MIN} символів`
      );
    }
    if (name.length > CATEGORY.MAX) {
      return Snackbar.displayMsg(
        `Текст пісні має містити максимум ${CATEGORY.MAX} символів`
      );
    }

    try {
      await createSong({ categories, name, text });
      Snackbar.displayMsg('Пісню додано');
      navigate(PAGES.CATEGORIES);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  if (!getCategories().length) {
    try {
      const categories = await getCategoriesAPI();
      setCategories(categories);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  }

  const container = Div({
    className: 'container',
  });

  const form = Form({
    className: 'tab_content',
    onSubmit: onAddNewSong,
  });

  const buttonContainer = Div({
    className: 'buttons_container',
  });
  buttonContainer.append(
    Button({
      text: 'Додати пісню',
      type: 'submit',
      color: 'green',
    }),
    Button({
      text: 'Назад',
      color: 'blue',
      onClick: () => navigateBack(),
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

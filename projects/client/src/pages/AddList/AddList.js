import { navigateBack } from '../../utils/navigate';
import Snackbar from '../../features/snackbar';
import {
  Button,
  Div,
  Form,
  Header2,
  Input,
  Option,
  Select,
} from '../../components';
import { createList, createRootList } from '../../api/lists';
import { getConfigs } from '../../api/configs';
import { logError } from '../../utils/helpers';

export default async id => {
  let configs = [];

  try {
    configs = await getConfigs({});
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }

  const onCancel = e => {
    e.preventDefault();
    navigateBack();
  };
  const onSaveList = async e => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const config = e.target.config.value;

    if (!name.length) {
      return Snackbar.displayMsg("List's name is required");
    }

    try {
      if (id) {
        await createList(id, { name, config });
      } else {
        await createRootList({ name, config });
      }
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    navigateBack();
  };

  const form = Form({
    className: 'container-center',
    onSubmit: onSaveList,
  });

  const configSelect = Select({
    name: 'config',
    required: true,
  });
  configSelect.append(
    ...configs.map(item =>
      Option({
        text: item.name,
        value: item.id,
      })
    )
  );

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Save',
      color: 'green',
    }),
    Button({
      onClick: onCancel,
      text: 'Cancel',
      color: 'red',
    })
  );

  form.append(
    Header2({
      text: 'Insert a name:',
    }),
    Input({
      name: 'name',
      type: 'text',
      placeholder: "List's name",
      focus: true,
    }),
    Header2({
      text: 'Select a config:',
    }),
    configSelect,
    buttons
  );

  return form;
};

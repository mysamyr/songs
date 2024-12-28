import { navigateBack } from '../../utils/navigate';
import Snackbar from '../../features/snackbar';
import {
  Button,
  Div,
  Label,
  Span,
  Form,
  Header2,
  Input,
} from '../../components';
import { createListItem } from '../../api/lists';
import { getListData } from '../../state';
import { FIELD_TYPES } from '../../constants';
import { getListItemValuesFromForm, logError } from '../../utils/helpers';

const getFieldInput = ({ type, description }, idx) => {
  if (type === FIELD_TYPES.NUMBER) {
    return Input({
      type: 'number',
      name: `${idx}`,
      placeholder: description,
      required: true,
    });
  } else if (type === FIELD_TYPES.BOOLEAN) {
    const checkboxLabel = Label();
    checkboxLabel.append(
      Input({
        type: 'checkbox',
        name: `${idx}`,
      }),
      Span({
        text: description,
      })
    );

    return checkboxLabel;
  } else {
    return Input({
      type: 'text',
      name: `${idx}`,
      placeholder: description,
      required: true,
      focus: !idx,
    });
  }
};

export default id => {
  const { name, config } = getListData();

  const onCancel = e => {
    e.preventDefault();
    navigateBack();
  };
  const onSaveListItem = async e => {
    e.preventDefault();
    try {
      const data = getListItemValuesFromForm(config.fields, e.target);
      await createListItem(id, data);
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    navigateBack();
  };

  const form = Form({
    className: 'container-center',
    onSubmit: onSaveListItem,
  });

  const configInputs = config.fields.map(getFieldInput);

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
      text: `Create a list item for ${name}:`,
    }),
    ...configInputs,
    buttons
  );

  return form;
};

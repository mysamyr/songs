import {
  Header,
  Button,
  Div,
  Label,
  Span,
  Form,
  Header2,
  Input,
} from '../../components';
import { FIELD_TYPES, HEADER_ICONS } from '../../constants';
import {
  INCORRECT_SORT,
  NO_FIELDS,
  NO_GREATER_MIN_IN_FIELD_$,
  NO_MIN_FIELD_$,
  NO_MIN_MAX_IN_FIELD_$,
  NO_NEGATIVE_MIN_MAX_IN_FIELD_$,
  NOT_UNIQUE_FIELD,
  UNKNOWN_TYPE,
} from '../../constants/error-messages';
import { navigateBack } from '../../utils/navigate';
import Snackbar from '../../features/snackbar';
import { createConfig } from '../../api/configs';
import {
  capitalizeFirstLetter,
  isNil,
  logError,
  validateName,
} from '../../utils/helpers';
import FieldCard from './FieldCard';

const validateConfigsData = ({ name, sort, fields }) => {
  const nameErr = validateName(name);
  if (nameErr) {
    throw new Error(nameErr);
  }
  if (!fields.length) {
    throw new Error(NO_FIELDS);
  }
  if (!fields[sort]) {
    throw new Error(INCORRECT_SORT);
  }
  const fieldsNameSet = fields.reduce(
    (acc, { description, type, min, max }) => {
      switch (type) {
        case FIELD_TYPES.STRING:
          // min is required, 0 or higher
          // max can be null or greater then min
          if (isNil(min)) {
            throw new Error(NO_MIN_FIELD_$(description));
          }
          if (min < 0 || max < 0) {
            throw new Error(NO_NEGATIVE_MIN_MAX_IN_FIELD_$(description));
          }
          if (!isNil(max) && min > max) {
            throw new Error(NO_GREATER_MIN_IN_FIELD_$(description));
          }
          break;
        case FIELD_TYPES.NUMBER:
          // both min and max are optional (nullable)
          // max should be greater than min
          if (!isNil(min) && !isNil(max) && min > max) {
            throw new Error(NO_GREATER_MIN_IN_FIELD_$(description));
          }
          break;
        case FIELD_TYPES.BOOLEAN:
          // no min/max (null)
          if (!isNil(min) || !isNil(max)) {
            throw new Error(NO_MIN_MAX_IN_FIELD_$(description));
          }
          break;
        default:
          throw new Error(UNKNOWN_TYPE);
      }
      acc.add(description);
      return acc;
    },
    new Set()
  );
  if (fields.length !== fieldsNameSet.size) {
    throw new Error(NOT_UNIQUE_FIELD);
  }
};

const getConfigFieldValuesFromForm = (fields, form) =>
  fields.map(({ idx }) => {
    const description = capitalizeFirstLetter(
      form[`${idx}_description`].value.trim()
    );
    const type = form[`${idx}_type`].value;
    if (type === FIELD_TYPES.BOOLEAN) {
      return {
        description,
        type,
      };
    }
    const min =
      form[`${idx}_min`].value === '' ? null : form[`${idx}_min`].value.trim();
    const max =
      form[`${idx}_max`].value === '' ? null : form[`${idx}_max`].value.trim();

    return {
      description,
      type,
      min,
      max,
    };
  });

export default () => {
  let fields = [
    { idx: 0, type: FIELD_TYPES.STRING, isDefault: true, isSortedBy: true },
  ];
  const onAdd = () => {
    const id = fields.length;
    fields.push({
      idx: id,
      type: FIELD_TYPES.STRING,
      isDefault: false,
      isSortedBy: false,
    });
    document.getElementById(`config-field_${id - 1}`).after(
      FieldCard({
        idx: id,
        type: FIELD_TYPES.STRING,
        isDefault: false,
        isSortedBy: false,
        onClickSort,
        onChangeType,
        onDelete,
      })
    );
  };
  const onClickSort = id => {
    fields = fields.map(i => {
      if (i.isSortedBy && i.idx !== id) {
        document.querySelector(`[name='${i.idx}_sort']`).checked = false;
      } else if (i.idx === id) {
        document.querySelector(`[name='${i.idx}_sort']`).checked = true;
      }

      return {
        ...i,
        isSortedBy: i.idx === id,
      };
    });
  };
  const onChangeType = (id, value) => {
    fields[id].type = value;
    if (value === FIELD_TYPES.BOOLEAN) {
      document.querySelector(`[name='${id}_min']`).disabled = true;
      document.querySelector(`[name='${id}_max']`).disabled = true;
    } else {
      document.querySelector(`[name='${id}_min']`).disabled = false;
      document.querySelector(`[name='${id}_max']`).disabled = false;
    }
  };
  const onDelete = id => {
    const fieldForDelete = fields[fields.findIndex(i => i.idx === id)];
    if (fieldForDelete.isSortedBy) {
      document.querySelector(`[name='0_sort']`).checked = true;
      fields[0].isSortedBy = true;
    }
    document.getElementById(`config-field_${id}`).remove();
    fields = fields.filter(i => i.idx !== id);
  };
  const onCancel = e => {
    e.preventDefault();
    navigateBack();
  };
  const onSaveConfig = async e => {
    e.preventDefault();
    const name = e.target.name.value.trim().toLowerCase();
    const sort = fields.findIndex(i => i.isSortedBy);
    const todo = e.target.todo.checked;
    const unique = e.target.unique.checked;
    const reqFields = getConfigFieldValuesFromForm(fields, e.target);

    try {
      validateConfigsData({ name, sort, fields: reqFields });
      await createConfig({ name, sort, todo, unique, fields: reqFields });
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }

    navigateBack();
  };

  const form = Form({
    className: 'container-center',
    onSubmit: onSaveConfig,
  });

  const todoCheckbox = Label();
  todoCheckbox.append(
    Input({
      name: 'unique',
      type: 'checkbox',
    }),
    Span({
      text: 'Name should be unique',
    })
  );

  const uniqueCheckbox = Label();
  uniqueCheckbox.append(
    Input({
      name: 'todo',
      type: 'checkbox',
    }),
    Span({
      text: 'Handle config as To-Do',
    })
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
      placeholder: "Config's name",
      focus: true,
    }),
    todoCheckbox,
    uniqueCheckbox,
    ...fields.map(item =>
      FieldCard({
        idx: item.idx,
        type: item.type,
        isDefault: item.isDefault,
        isSortedBy: item.isSortedBy,
        onClickSort,
        onChangeType,
        onDelete,
      })
    ),
    Div({
      className: 'config-add-btn',
      text: '+',
      onClick: onAdd,
    }),
    buttons
  );

  document.getElementById('root').append(
    Header({
      title: 'Add new config',
      leftContent: HEADER_ICONS.BACK,
    }),
    form
  );
};

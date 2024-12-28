import { FIELD_TYPE_NAMES, FIELD_TYPES } from '../../constants';
import { Div, Input, Option, Select } from '../../components';

export default ({
  idx,
  type,
  isDefault,
  isSortedBy,
  onChangeType,
  onClickSort,
  onDelete,
}) => {
  const container = Div({
    id: `config-field_${idx}`,
    className: 'config-field',
  });

  const nameRow = Div({
    className: 'config-field-row',
  });
  const description = Input({
    name: idx + '_description',
    type: 'text',
    placeholder: 'Fields name',
    disabled: isDefault,
    value: isDefault ? 'Name' : '',
  });

  nameRow.append(
    Input({
      name: idx + '_sort',
      type: 'checkbox',
      checked: isSortedBy,
      onChange: () => onClickSort(idx),
    }),
    description
  );

  if (!isDefault) {
    nameRow.appendChild(
      Div({
        className: 'config-field-delete',
        text: '×',
        onClick: () => onDelete(idx),
      })
    );
  }

  const typeRow = Div({
    className: 'config-field-row',
  });
  const typeSelect = Select({
    name: idx + '_type',
    value: FIELD_TYPE_NAMES[type],
    disabled: isDefault,
    onChange: e => onChangeType(idx, e.target.value),
  });
  typeSelect.append(
    ...[FIELD_TYPES.STRING, FIELD_TYPES.NUMBER, FIELD_TYPES.BOOLEAN].map(type =>
      Option({
        value: type,
        text: FIELD_TYPE_NAMES[type],
      })
    )
  );

  typeRow.append(
    typeSelect,
    Input({
      className: 'config-field-minmax',
      name: idx + '_min',
      type: 'number',
      value: '3',
      step: '0.1',
      disabled: isDefault || type === FIELD_TYPES.BOOLEAN,
    }),
    Input({
      className: 'config-field-minmax',
      name: idx + '_max',
      type: 'number',
      value: '30',
      disabled: isDefault || type === FIELD_TYPES.BOOLEAN,
    })
  );

  container.append(nameRow, typeRow);

  return container;
};

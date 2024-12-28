import { SORT_DIRECTIONS } from '../../constants';
import { Button, Radio, Div, Form } from '../';
import { getQueryParam } from '../../utils/query-params';
import { getListData } from '../../state';
import { hideModal } from '../../features/modal';

const fieldOptions = ({ sort: defaultSort, fields }, sort) => [
  ...fields.map((field, idx) =>
    Radio({
      value: idx,
      name: 'sort',
      description: field.description,
      checked: sort ? +sort === idx : defaultSort === idx,
    })
  ),
  document.createElement('hr'),
];

export default ({ onSubmit }) => {
  const direction = getQueryParam('direction');
  const sort = getQueryParam('sort');
  const { config } = getListData();

  const form = Form({
    className: 'container',
    onSubmit,
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Apply',
      color: 'green',
    }),
    Button({
      onClick: hideModal,
      text: 'Cancel',
      color: 'red',
    })
  );

  form.append(
    ...fieldOptions(config, sort),
    Radio({
      value: SORT_DIRECTIONS.ASC,
      name: 'direction',
      description: 'ASC',
      checked: !direction || direction === SORT_DIRECTIONS.ASC,
    }),
    Radio({
      value: SORT_DIRECTIONS.DESC,
      name: 'direction',
      description: 'DESC',
      checked: direction === SORT_DIRECTIONS.DESC,
    }),
    buttons
  );

  return form;
};

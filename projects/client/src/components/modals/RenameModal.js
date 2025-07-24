import { CATEGORY } from '../../constants/validation';
import { Button, Div, Paragraph, Form, Input } from '../';
import { hideModal } from '../../features/modal';

export default ({ name, onSubmit }) => {
  const form = Form({
    className: 'modal-content',
    onSubmit,
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Перейменувати',
      color: 'green',
    }),
    Button({
      onClick: hideModal,
      text: 'Скасувати',
      color: 'red',
    })
  );

  form.append(
    Paragraph({
      text: 'Введіть нову назву:',
      className: 'modal-header',
    }),
    Input({
      type: 'text',
      name: 'name',
      value: name,
      min: CATEGORY.MIN,
      max: CATEGORY.MAX,
      required: true,
      focus: true,
    }),
    buttons
  );
  return form;
};

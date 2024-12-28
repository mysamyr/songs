import { Button, Div, Paragraph, Form, Input } from '../';
import { hideModal } from '../../features/modal';

export default ({ name, onSubmit }) => {
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
      text: 'Rename',
      color: 'green',
    }),
    Button({
      onClick: hideModal,
      text: 'Cancel',
      color: 'red',
    })
  );

  form.append(
    Paragraph({
      text: 'Enter new name:',
    }),
    Input({
      type: 'text',
      name: 'name',
      value: name,
      required: true,
      focus: true,
    }),
    buttons
  );
  return form;
};

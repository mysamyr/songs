import { Button, Div, Paragraph, Form, Input } from '../';
import { hideModal } from '../../features/modal';
import Snackbar from '../../features/snackbar';
import { forgotPassword } from '../../api/auth';
import { logError } from '../../utils/helpers';

export default () => {
  const onSubmit = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      await forgotPassword({ email });
      Snackbar.displayMsg(
        'Message with instructions has been sent to provided e-mail'
      );
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

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
      text: 'Recover',
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
      text: "We'll send you instructions on how to change it. Enter your email address associated with your account.",
    }),
    Input({
      type: 'email',
      name: 'email',
      value: name,
      required: true,
      focus: true,
    }),
    buttons
  );
  return form;
};

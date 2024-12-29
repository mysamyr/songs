import {
  Header,
  Form,
  Header2,
  Input,
  SubmitModal,
  Button,
  Div,
  Paragraph,
  Header1,
  Label,
  Span,
} from '../../components';
import { PASSWORD } from '../../constants';
import { hideModal, showModal } from '../../features/modal';
import {
  changeEmail,
  changePassword,
  // resendVerification,
  deleteAccount,
} from '../../api/cabinet';
import Snackbar from '../../features/snackbar';
import { getUser } from '../../state/user';
import { logout } from '../../features/auth';

const EmailChangeForm = () => {
  // todo add resend verification email
  const user = getUser();
  const onChangeEmail = async email => {
    try {
      await changeEmail({ email });
      hideModal();
    } catch (e) {
      Snackbar.displayMsg(e.message);
      return hideModal();
    }
    await logout();
  };

  const onSubmitChangeEmail = e => {
    e.preventDefault();
    const newEmail = e.target.email.value;
    if (!newEmail.length)
      return Snackbar.displayMsg('Електронна пошта не може бути пустою');
    if (newEmail === user.email)
      return Snackbar.displayMsg('Введіть нову пошту');
    showModal(
      SubmitModal({
        onConfirm: () => onChangeEmail(newEmail),
        question: 'Ви впевнені, що хочете змінити електронну пошту?',
      })
    );
  };

  const form = Form({
    className: 'input-field',
    onSubmit: onSubmitChangeEmail,
  });

  const buttonContainer = Div({
    className: 'buttons_container',
  });
  buttonContainer.append(
    Button({
      type: 'submit',
      text: 'Змінити пошту',
      color: 'green',
    })
  );

  form.append(
    Header2({
      text: 'Електронна пошта',
    }),
    Input({
      name: 'email',
      type: 'email',
      value: user.email,
    }),
    buttonContainer
  );

  return form;
};

const PasswordChangeForm = () => {
  const onChangePassword = async (password, newPassword) => {
    try {
      await changePassword({ password, newPassword });
      hideModal();
    } catch (e) {
      Snackbar.displayMsg(e.message);
      return hideModal();
    }
    await logout();
  };

  const onSubmitChangePassword = e => {
    e.preventDefault();
    const oldPassword = e.target.password.value;
    const newPassword = e.target.newPassword.value;
    const repeatNewPassword = e.target.confirm.value;
    if (!oldPassword.length || !newPassword.length || !repeatNewPassword.length)
      return Snackbar.displayMsg("Всі поля є обов'язковими");
    if (oldPassword === newPassword)
      return Snackbar.displayMsg('Новий пароль не може бути таким самим');
    if (newPassword !== repeatNewPassword)
      return Snackbar.displayMsg('Паролі не співпадають');
    if (newPassword.length < PASSWORD.MIN || newPassword.length > PASSWORD.MAX)
      return Snackbar.displayMsg(
        `Пароль має містити від ${PASSWORD.MIN} до ${PASSWORD.MAX} символів`
      );
    showModal(
      SubmitModal({
        onConfirm: () => onChangePassword(oldPassword, newPassword),
        question: 'Ви впевнені, що хочете змінити пароль?',
      })
    );
  };

  const form = Form({
    className: 'input-field',
    onSubmit: onSubmitChangePassword,
  });

  const currentPassword = Label();
  currentPassword.append(
    Span({
      text: 'Теперішній пароль:',
    }),
    Input({
      type: 'password',
      name: 'password',
      min: PASSWORD.MIN,
      max: PASSWORD.MAX,
      required: true,
    })
  );
  const newPassword = Label();
  newPassword.append(
    Span({
      text: 'Новий пароль:',
    }),
    Input({
      type: 'password',
      name: 'newPassword',
      min: PASSWORD.MIN,
      max: PASSWORD.MAX,
      required: true,
    })
  );
  const confirmPassword = Label();
  confirmPassword.append(
    Span({
      text: 'Підтвердження паролю:',
    }),
    Input({
      type: 'password',
      name: 'confirm',
      min: PASSWORD.MIN,
      max: PASSWORD.MAX,
      required: true,
    })
  );

  const buttonContainer = Div({
    className: 'buttons_container',
  });
  buttonContainer.append(
    Button({
      type: 'submit',
      text: 'Змінити пароль',
      color: 'green',
    })
  );

  form.append(
    Header2({
      text: 'Пароль',
    }),
    currentPassword,
    newPassword,
    confirmPassword,
    buttonContainer
  );

  return form;
};

const AccountDeleteSection = () => {
  const onDeleteAccount = async () => {
    try {
      await deleteAccount();
      hideModal();
    } catch (e) {
      Snackbar.displayMsg(e.message);
      return hideModal();
    }
    await logout();
  };

  const onSubmitDeleteAccount = () => {
    showModal(
      SubmitModal({
        onConfirm: onDeleteAccount,
        question: 'Ви впевнені, що хочете видалити свій профіль?',
        confirmText: 'Так, видалити',
        inverseColors: true,
      })
    );
  };

  const container = Div({
    className: 'input-field',
  });

  const buttonContainer = Div({
    className: 'buttons_container',
  });
  buttonContainer.append(
    Button({
      text: 'Видалити профіль',
      color: 'red',
      onClick: onSubmitDeleteAccount,
    })
  );

  container.append(
    Header2({
      text: 'Видалення профілю',
    }),
    Paragraph({
      text: 'Після видалення вашого профілю Ви втратите можливість створювати нові пісні чи категорії чи редагувати створені Вами пісні. Ваша електронна пошта буде вільна для подальшої реєстрації.',
    }),
    buttonContainer
  );

  return container;
};

export default () => {
  const container = Div({
    className: 'container',
  });

  container.append(
    Header1({
      text: 'Персональний кабінет',
    }),
    EmailChangeForm(),
    PasswordChangeForm(),
    AccountDeleteSection()
  );
  document.getElementById('root').append(Header(), container);
};

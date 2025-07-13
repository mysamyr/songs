import {
  Button,
  Div,
  Form,
  Header1,
  Header2,
  Input,
  Label,
  Paragraph,
  Span,
  SubmitModal,
} from '../../components';
import { USER_PASSWORD } from '../../constants/validation';
import {
  ALL_FIELDS_REQUIRED,
  EMPTY_EMAIL,
  NOT_SAME_PASSWORDS,
  SHORT_PASSWORD,
} from '../../constants/messages';
import { hideModal, showModal } from '../../features/modal';
import {
  changeEmail,
  changePassword,
  deleteAccount,
  resendVerification,
} from '../../api/cabinet';
import Snackbar from '../../features/snackbar';
import { getUserEmail, isVerifiedUser } from '../../state/user';
import { logout } from '../../features/auth';
import {
  CHANGE_EMAIL_QUESTION,
  CHANGE_PASSWORD_QUESTION,
  DELETE_ACCOUNT_MESSAGE,
  DELETE_ACCOUNT_QUESTION,
  RESEND_SUCCESS,
  RESENT_VERIFICATION,
  RESENT_VERIFICATION_BTN,
  SAME_EMAIL,
  SAME_PASSWORD,
} from './messages';
import { renderPageWithHeader } from '../../utils/dom';

const EmailChangeForm = () => {
  const email = getUserEmail();
  const isVerified = isVerifiedUser();
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
  const onResendValidation = async () => {
    try {
      await resendVerification();
      Snackbar.displayMsg(RESEND_SUCCESS);
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
    if (!newEmail.length) return Snackbar.displayMsg(EMPTY_EMAIL);
    if (newEmail === email) return Snackbar.displayMsg(SAME_EMAIL);
    showModal(
      SubmitModal({
        onConfirm: () => onChangeEmail(newEmail),
        question: CHANGE_EMAIL_QUESTION,
      })
    );
  };

  const form = Form({
    className: 'input-field',
    onSubmit: onSubmitChangeEmail,
  });

  form.append(
    Header2({
      text: 'Електронна пошта',
    }),
    Input({
      name: 'email',
      type: 'email',
      value: email,
    })
  );

  if (!isVerified) {
    const paragraph = Paragraph();
    paragraph.append(
      document.createTextNode(RESENT_VERIFICATION),
      Span({
        text: RESENT_VERIFICATION_BTN,
        className: 'link',
        onClick: onResendValidation,
      })
    );
    form.appendChild(paragraph);
  }

  const buttonContainer = Div({
    className: 'btns',
  });
  buttonContainer.append(
    Button({
      type: 'submit',
      text: 'Змінити пошту',
      color: 'green',
    })
  );
  form.appendChild(buttonContainer);

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
      return Snackbar.displayMsg(ALL_FIELDS_REQUIRED);
    if (oldPassword === newPassword) return Snackbar.displayMsg(SAME_PASSWORD);
    if (newPassword !== repeatNewPassword)
      return Snackbar.displayMsg(NOT_SAME_PASSWORDS);
    if (newPassword.length < USER_PASSWORD.MIN)
      return Snackbar.displayMsg(SHORT_PASSWORD);
    showModal(
      SubmitModal({
        onConfirm: () => onChangePassword(oldPassword, newPassword),
        question: CHANGE_PASSWORD_QUESTION,
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
      min: USER_PASSWORD.MIN,
      max: USER_PASSWORD.MAX,
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
      min: USER_PASSWORD.MIN,
      max: USER_PASSWORD.MAX,
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
      min: USER_PASSWORD.MIN,
      max: USER_PASSWORD.MAX,
      required: true,
    })
  );

  const buttonContainer = Div({
    className: 'btns',
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
        question: DELETE_ACCOUNT_QUESTION,
        confirmText: 'Так, видалити',
        inverseColors: true,
      })
    );
  };

  const container = Div({
    className: 'input-field',
  });

  const buttonContainer = Div({
    className: 'btns',
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
      text: DELETE_ACCOUNT_MESSAGE,
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

  renderPageWithHeader(container);
};

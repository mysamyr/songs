import {
  Header,
  Form,
  Header2,
  Input,
  SubmitModal,
  Button,
  Div,
  Paragraph,
} from '../../components';
import { HEADER_ICONS, PASSWORD } from '../../constants';
import { hideModal, showModal } from '../../features/modal';
import {
  changeUserEmail,
  changeUserPassword,
  deleteUserAccount,
} from '../../api/auth';
import Snackbar from '../../features/snackbar';
import { getUser } from '../../state/user';
import { logout } from '../../features/auth';

const EmailChangeForm = () => {
  const user = getUser();
  const onChangeEmail = async email => {
    try {
      await changeUserEmail({ email });
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
    if (!newEmail.length) return Snackbar.displayMsg('Email can not be empty');
    if (newEmail === user.email)
      return Snackbar.displayMsg('Enter a new email');
    showModal(
      SubmitModal({
        onConfirm: () => onChangeEmail(newEmail),
        question: 'Are you sure you want to change email?',
      })
    );
  };

  const form = Form({
    className: 'container',
    onSubmit: onSubmitChangeEmail,
  });

  form.append(
    Header2({
      text: 'Change email',
    }),
    Input({
      name: 'email',
      type: 'email',
      value: user.email,
    }),
    Button({
      type: 'submit',
      text: 'Change Email',
      color: 'blue',
    })
  );

  return form;
};

const PasswordChangeForm = () => {
  const onChangePassword = async (oldPassword, newPassword) => {
    try {
      await changeUserPassword({ oldPassword, newPassword });
      hideModal();
    } catch (e) {
      Snackbar.displayMsg(e.message);
      return hideModal();
    }
    await logout();
  };

  const onSubmitChangePassword = e => {
    e.preventDefault();
    const oldPassword = e.target.oldPass.value;
    const newPassword = e.target.newPass.value;
    const repeatNewPassword = e.target.rNewPass.value;
    if (!oldPassword.length || !newPassword.length || !repeatNewPassword.length)
      return Snackbar.displayMsg('All fields are required');
    if (oldPassword === newPassword)
      return Snackbar.displayMsg("Password didn't change");
    if (newPassword !== repeatNewPassword)
      return Snackbar.displayMsg("Passwords don't match");
    if (newPassword.length < PASSWORD.MIN || newPassword.length > PASSWORD.MAX)
      return Snackbar.displayMsg('Password should be 8 - 30 characters long');
    showModal(
      SubmitModal({
        onConfirm: () => onChangePassword(oldPassword, newPassword),
        question: 'Are you sure you want to change password?',
      })
    );
  };

  const form = Form({
    className: 'container',
    onSubmit: onSubmitChangePassword,
  });

  form.append(
    Header2({
      text: 'Change Password',
    }),
    Input({
      name: 'oldPass',
      type: 'password',
      placeholder: 'Old password',
    }),
    Input({
      name: 'newPass',
      type: 'password',
      placeholder: 'New password',
    }),
    Input({
      name: 'rNewPass',
      type: 'password',
      placeholder: 'Repeat new password',
    }),
    Button({
      type: 'submit',
      text: 'Change Password',
      color: 'blue',
    })
  );

  return form;
};

const AccountDeleteSection = () => {
  const onDeleteAccount = async () => {
    try {
      await deleteUserAccount();
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
        question: 'Are you sure you want to delete your account?',
        confirmText: 'Delete',
        inverseColors: true,
      })
    );
  };

  const container = Div({
    className: 'container',
  });

  container.append(
    Header2({
      text: 'Delete Account',
    }),
    Paragraph({
      text: 'If you delete your account all your lists will be permanently deleted!',
    }),
    Button({
      text: 'Delete account',
      color: 'red',
      onClick: onSubmitDeleteAccount,
    })
  );

  return container;
};

export default () => {
  document.getElementById('root').append(
    Header({
      title: 'Cabinet',
      leftContent: HEADER_ICONS.MENU,
    }),
    EmailChangeForm(),
    PasswordChangeForm(),
    AccountDeleteSection()
  );
};

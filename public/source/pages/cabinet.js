import { passwordValidate, showFlashErr } from '../helpers.js';

const emailForm = () => {
  const emailForm = document.getElementById('email-form');
  const email = document.getElementById('email');
  const currentEmail = email.defaultValue;
  emailForm.addEventListener('submit', e => {
    if (email.value === currentEmail) {
      showFlashErr('Новий email не може співпадати з поточним', 'h1');
      e.preventDefault();
    }
  });
	document.getElementById('email-reset').addEventListener('click', e => {
    e.preventDefault();
    email.value = currentEmail;
  });
};

const passwordForm = () => {
  const passwordForm = document.getElementById('password-form');
  const [oldPass, newPass, confirmPass] =
    passwordForm.getElementsByTagName('input');
  passwordValidate(passwordForm, 'newPassword', 'confirm', '#change-password');
  newPass.addEventListener('keyup', () => {
    if (oldPass.value === newPass.value) {
      newPass.setCustomValidity('Старий і новий паролі не мають співпадати');
    } else if (confirmPass.value !== newPass.value) {
      newPass.setCustomValidity(
        'Новий пароль і підтвердження мають співпадати'
      );
    } else {
      newPass.setCustomValidity('');
      confirmPass.setCustomValidity('');
    }
  });
  confirmPass.addEventListener('keyup', () => {
    if (confirmPass.value !== newPass.value) {
      confirmPass.setCustomValidity(
        'Новий пароль і підтвердження мають співпадати'
      );
    } else {
      if (oldPass.value !== newPass.value) {
        newPass.setCustomValidity('');
      }
      confirmPass.setCustomValidity('');
    }
  });

	document.getElementById('password-reset').addEventListener('click', e => {
    e.preventDefault();
    passwordForm.reset();
  });
};

export default () => {
  emailForm();
  passwordForm();
};

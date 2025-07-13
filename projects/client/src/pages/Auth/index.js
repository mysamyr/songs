import { PAGES } from '../../constants';
import { USER_NAME, USER_PASSWORD } from '../../constants/validation';
import { signup } from '../../api/auth';
import { Button, Div, Form, Input, Label, Span } from '../../components';
import Snackbar from '../../features/snackbar';
import { login } from '../../features/auth';
import { navigate } from '../../utils/navigate';
import { LOGIN_SUCCESS, REGISTRATION_SUCCESS, TITLE } from './messages';
import { getQueryParam, setQueryParam } from '../../utils/query-params';
import { renderPageWithHeader } from '../../utils/dom';
import { validateLogin, validateRegistration } from '../../utils/validation';

const emailLabel = Label({
  className: 'input-field',
});
emailLabel.append(
  Span({
    text: 'Email:',
  }),
  Input({
    type: 'email',
    name: 'email',
    focus: true,
    required: true,
  })
);

const passwordLabel = Label({
  className: 'input-field',
});
passwordLabel.append(
  Span({
    text: 'Пароль:',
  }),
  Input({
    type: 'password',
    name: 'password',
    min: USER_PASSWORD.MIN,
    max: USER_PASSWORD.MAX,
    required: true,
  })
);

const handleLogin = async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const { error, value } = validateLogin(email, password);
  if (error) Snackbar.displayMsg(error);

  try {
    await login(value);
    Snackbar.displayMsg(LOGIN_SUCCESS);
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }
};

const handleRegistration = async e => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirm = e.target.confirm.value;

  const { error, value } = validateRegistration(name, email, password, confirm);
  if (error) Snackbar.displayMsg(error);

  try {
    await signup(value);
    Snackbar.displayMsg(REGISTRATION_SUCCESS);
    navigate(PAGES.HOME);
  } catch (e) {
    Snackbar.displayMsg(e.message);
  }
};

const LoginPage = () => {
  const form = Form({
    className: 'tab-content',
    onSubmit: handleLogin,
  });

  const buttonContainer = Div({
    className: 'btns',
  });
  buttonContainer.append(
    Button({
      text: 'Увійти',
      type: 'submit',
      color: 'green',
    })
  );

  form.append(emailLabel, passwordLabel, buttonContainer);

  return form;
};

const RegistrationPage = () => {
  const form = Form({
    className: 'tab-content',
    onSubmit: handleRegistration,
  });

  const nameLabel = Label({
    className: 'input-field',
  });
  nameLabel.append(
    Span({
      text: "Введіть ім'я:",
    }),
    Input({
      type: 'text',
      name: 'name',
      min: USER_NAME.MIN,
      max: USER_NAME.MAX,
      required: true,
    })
  );

  const confirmPassword = Label({
    className: 'input-field',
  });
  confirmPassword.append(
    Span({
      text: 'Повторіть пароль:',
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
      text: 'Зареєструватися',
      type: 'submit',
      color: 'green',
    })
  );

  form.append(
    nameLabel,
    emailLabel,
    passwordLabel,
    confirmPassword,
    buttonContainer
  );

  return form;
};

export default () => {
  const tab = getQueryParam('tab');
  if (!tab) setQueryParam('tab', 'login');

  const container = Div({
    className: 'container',
  });
  const switchButtons = Div({
    className: 'tab-headers',
  });

  const loginBtn = Div({
    id: 'login-btn',
    className: 'tab',
    text: 'Увійти',
    onClick: e => {
      if (e.target.classList.contains('tab-active')) return;
      document
        .querySelectorAll('.tab')
        .forEach(tab => tab.classList.toggle('tab-active'));
      document.querySelector('form').remove();
      container.append(LoginPage());
    },
  });
  const signupBtn = Div({
    id: 'signup-btn',
    className: 'tab',
    text: 'Зареєструватися',
    onClick: e => {
      if (e.target.classList.contains('tab-active')) return;
      document
        .querySelectorAll('.tab')
        .forEach(tab => tab.classList.toggle('tab-active'));
      document.querySelector('form').remove();
      container.append(RegistrationPage());
    },
  });

  switchButtons.append(loginBtn, signupBtn);
  if (tab === 'signup') {
    signupBtn.classList.add('tab-active');
    container.append(switchButtons, RegistrationPage());
  } else {
    loginBtn.classList.add('tab-active');
    container.append(switchButtons, LoginPage());
  }

  renderPageWithHeader(TITLE, container);
};

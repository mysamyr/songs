import { PAGES, PASSWORD } from '../../constants';
import {
  EMPTY_EMAIL,
  SHORT_PASSWORD,
  NOT_SAME_PASSWORDS,
} from '../../constants/messages';
import { signup } from '../../api/auth';
import {
  Header,
  Button,
  Div,
  Label,
  Span,
  Form,
  Input,
} from '../../components';
import Snackbar from '../../features/snackbar';
import { login } from '../../features/auth';
import { navigate } from '../../utils/navigate';
import { LOGIN_SUCCESS, REGISTRATION_SUCCESS } from './messages';

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
    min: PASSWORD.MIN,
    max: PASSWORD.MAX,
    required: true,
  })
);

const LoginPage = () => {
  const handleLogin = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.length) {
      return Snackbar.displayMsg(EMPTY_EMAIL);
    }
    if (password.length < PASSWORD.MIN) {
      return Snackbar.displayMsg(SHORT_PASSWORD);
    }

    try {
      await login({ email, password });
      Snackbar.displayMsg(LOGIN_SUCCESS);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };
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
  const handleRegistration = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (!email.length) {
      return Snackbar.displayMsg(EMPTY_EMAIL);
    }
    if (password.length < PASSWORD.MIN || confirm.length < PASSWORD.MIN) {
      return Snackbar.displayMsg(SHORT_PASSWORD);
    }
    if (password !== confirm) {
      return Snackbar.displayMsg(NOT_SAME_PASSWORDS);
    }

    try {
      await signup({ email, password });
      Snackbar.displayMsg(REGISTRATION_SUCCESS);
      navigate(PAGES.HOME);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };
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
      min: 2,
      max: 20,
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
      min: PASSWORD.MIN,
      max: PASSWORD.MAX,
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
  const container = Div({
    className: 'container',
  });
  const switchButtons = Div({
    className: 'tab-headers',
  });

  const loginBtn = Div({
    id: 'login-btn',
    className: 'tab tab-active',
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

  container.append(switchButtons, LoginPage());

  document.getElementById('root').append(Header(), container);
};

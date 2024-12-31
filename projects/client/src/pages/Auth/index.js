import { PAGES, PASSWORD } from '../../constants';
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
      return Snackbar.displayMsg('Пошта не може бути порожньою');
    }
    if (password.length < PASSWORD.MIN) {
      return Snackbar.displayMsg(
        `Пароль має містити мінімум ${PASSWORD.MIN} символів`
      );
    }

    try {
      await login({ email, password });
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
      return Snackbar.displayMsg('Email cannot be empty');
    }
    if (password.length < PASSWORD.MIN || confirm.length < PASSWORD.MIN) {
      return Snackbar.displayMsg(
        `Пароль має містити мінімум ${PASSWORD.MIN} символів`
      );
    }
    if (password !== confirm) {
      return Snackbar.displayMsg('Паролі не співпадають');
    }

    try {
      await signup({ email, password });
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

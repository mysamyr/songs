import { SUCCESSFUL_REGISTRATION } from '../../constants/messages';
import { signup } from '../../api/auth';
import {
  Header,
  Button,
  Div,
  Label,
  Span,
  Form,
  Header1,
  Header2,
  Input,
  ForgotPasswordModal,
} from '../../components';
import Snackbar from '../../features/snackbar';
import { login } from '../../features/auth';
import { showModal } from '../../features/modal';

const emailLabel = Label({
  className: 'auth-label',
});
emailLabel.append(
  Span({
    text: 'Email:',
  }),
  Input({
    type: 'email',
    name: 'email',
    focus: true,
  })
);

const passwordLabel = Label({
  className: 'auth-label',
});
passwordLabel.append(
  Span({
    text: 'Password:',
  }),
  Input({
    type: 'password',
    name: 'password',
  })
);

const LoginPage = () => {
  const handleLogin = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.length) {
      return Snackbar.displayMsg('Email cannot be empty');
    }
    if (password.length < 8) {
      return Snackbar.displayMsg('Password must be at least 8 characters');
    }

    try {
      await login({ email, password });
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };
  const container = Div({
    className: 'container',
  });

  const form = Form({
    className: 'column',
    onSubmit: handleLogin,
  });

  form.append(
    emailLabel,
    passwordLabel,
    Button({
      text: 'Login',
      type: 'submit',
      color: 'blue',
    })
  );

  const forgotPassBtn = Div({
    onClick: () => {
      showModal(ForgotPasswordModal());
    },
  });
  forgotPassBtn.append(
    document.createTextNode('Forgot your password? '),
    Span({
      text: 'Click here!',
      className: 'auth-link',
    })
  );

  const changeBtn = Div({
    onClick: () => {
      document.querySelector('.container').remove();
      document.querySelector('.header-title').innerText = 'Registration';
      document.querySelector('.header-container').after(RegistrationPage());
    },
  });
  changeBtn.append(
    document.createTextNode("Don't have an account? "),
    Span({
      text: 'Register',
      className: 'auth-link',
    })
  );

  container.append(
    Header1({
      className: 'auth-header',
      text: 'Hello, Welcome back!',
    }),
    Header2({
      text: 'Happy to see you, please login here.',
      className: 'auth-subheader',
    }),
    form,
    forgotPassBtn,
    changeBtn
  );

  return container;
};

const RegistrationPage = () => {
  const showLogin = () => {
    document.querySelector('.container').remove();
    document.querySelector('.header-title').innerText = 'Login';
    document.querySelector('.header-container').after(LoginPage());
  };
  const handleRegistration = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.length) {
      return Snackbar.displayMsg('Email cannot be empty');
    }
    if (password.length < 8) {
      return Snackbar.displayMsg('Password must be at least 8 characters');
    }

    try {
      await signup({ email, password });
      Snackbar.displayMsg(SUCCESSFUL_REGISTRATION);
      showLogin();
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };
  const container = Div({
    className: 'container',
  });

  const form = Form({
    className: 'column',
    onSubmit: handleRegistration,
  });

  form.append(
    emailLabel,
    passwordLabel,
    Button({
      text: 'Register',
      type: 'submit',
      color: 'blue',
    })
  );

  const changeBtn = Div({
    onClick: showLogin,
  });
  changeBtn.append(
    document.createTextNode('Already have an account? '),
    Span({
      text: 'Login',
      className: 'auth-link',
    })
  );

  container.append(
    Header1({
      className: 'auth-header',
      text: 'Hello, Welcome!',
    }),
    Header2({
      text: "First, let's create your account.",
      className: 'auth-subheader',
    }),
    form,
    changeBtn
  );

  return container;
};

export default () => {
  document.getElementById('root').append(
    Header({
      title: 'Login',
    }),
    LoginPage()
  );
};

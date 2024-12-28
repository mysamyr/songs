import { PAGES } from '../../constants';
import { Header, Button, Div, Header1, Form, Input } from '../../components';
import { checkActivationId, recoverPassword } from '../../api/auth';
import Snackbar from '../../features/snackbar';
import { navigate } from '../../utils/navigate';
import { isLoggedIn } from '../../features/auth';
import { logError } from '../../utils/helpers';

const getActivationId = () => window.location.pathname.split('/')[3];

export default async () => {
  const id = getActivationId();

  if (isLoggedIn()) {
    Snackbar.displayMsg('You cannot activate account while logged in');
    return navigate(PAGES.LISTS);
  }
  try {
    if (id) {
      await checkActivationId(id);
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    Snackbar.displayMsg('Link is not valid');
    return navigate(PAGES.LOGIN);
  }

  const onChangePassword = async e => {
    e.preventDefault();
    const password = e.target.password.value;
    try {
      await recoverPassword(id, { password });
      Snackbar.displayMsg('Password was changed');
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    navigate(PAGES.LOGIN);
  };

  const activationContainer = Form({
    className: 'container',
    onSubmit: onChangePassword,
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Change Password',
      color: 'blue',
    }),
    Button({
      onClick: () => navigate(PAGES.LOGIN),
      text: 'Go To Login Page',
      color: 'red',
    })
  );

  activationContainer.append(
    Header1({
      text: 'Enter new password below:',
    }),
    Input({
      type: 'password',
      name: 'password',
      placeholder: 'Enter new password',
      required: true,
      focus: true,
    }),
    buttons
  );

  document.getElementById('root').append(
    Header({
      title: 'Update Password',
    }),
    activationContainer
  );
};

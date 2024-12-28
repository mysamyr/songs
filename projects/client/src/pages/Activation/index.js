import { PAGES } from '../../constants';
import { Header, Button, Div, Paragraph, Header1 } from '../../components';
import { activate } from '../../api/auth';
import Snackbar from '../../features/snackbar';
import { navigate } from '../../utils/navigate';
import { isLoggedIn } from '../../features/auth';

const getActivationId = () => window.location.pathname.split('/')[3];

export default async () => {
  const id = getActivationId();
  let isActivated = false;

  if (isLoggedIn()) {
    Snackbar.displayMsg('You cannot activate account while logged in');
    return navigate(PAGES.LISTS);
  }
  try {
    if (id) {
      await activate(id);
      isActivated = true;
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    Snackbar.displayMsg('Account cannot be activated');
  }

  const activationContainer = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: () => navigate(PAGES.LOGIN),
      text: 'Go To Login Page',
      color: 'blue',
    })
  );

  activationContainer.append(
    Header1({
      text: isActivated ? 'Congratulations!' : 'An Error has happened!',
    }),
    Paragraph({
      text: isActivated
        ? 'Your account has been activated. You can now login and use Lister App.'
        : 'You have got an error while activating your account. Please try to use a valid activation link or request new account activation.',
    }),
    buttons
  );

  document.getElementById('root').append(
    Header({
      title: 'Account activation',
    }),
    activationContainer
  );
};

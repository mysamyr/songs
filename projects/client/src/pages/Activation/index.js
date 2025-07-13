import { PAGES } from '../../constants';
import { Button, Div, Header1, Paragraph } from '../../components';
import { activate } from '../../api/auth';
import { navigate } from '../../utils/navigate';
import { isLoggedIn } from '../../features/auth';
import { getUser, saveUser } from '../../state/user';
import {
  HEADER_FAIL,
  HEADER_SUCCESS,
  MESSAGE_FAIL,
  MESSAGE_SUCCESS,
} from './messages';
import { BACK_HOME } from '../../constants/messages';
import { renderPageWithHeader } from '../../utils/dom';

export default async () => {
  const id = window.location.pathname.split('/')[3];
  let isActivated = false;

  try {
    if (id) {
      await activate(id);

      if (isLoggedIn()) {
        const user = getUser();
        saveUser({
          ...user,
          verified: true,
        });
      }
      isActivated = true;
    }
    // eslint-disable-next-line no-empty
  } catch {}

  const activationContainer = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.appendChild(
    Button({
      onClick: () => navigate(PAGES.HOME),
      text: BACK_HOME,
      color: 'blue',
    })
  );

  activationContainer.appendChild(
    Header1({
      text: isActivated ? HEADER_SUCCESS : HEADER_FAIL,
    })
  );

  if (isActivated) {
    activationContainer.appendChild(
      Paragraph({
        text: MESSAGE_SUCCESS,
      })
    );
  } else {
    activationContainer.append(
      ...MESSAGE_FAIL.map(message => Paragraph({ text: message }))
    );
  }

  activationContainer.appendChild(buttons);
  renderPageWithHeader(activationContainer);
};

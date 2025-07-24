import { PAGES } from '../../constants';
import { Div, Header1, Paragraph, Span } from '../../components';
import { textConfigs } from '../../constants/navigation';
import { isLoggedIn } from '../../features/auth';
import { getUserName } from '../../state/user';
import {
  CALL_TO_ACTION,
  CALL_TO_ACTION_REGISTER,
  CALL_TO_ACTION_YOU_NEED_TO,
  CALL_TO_MAIL,
  EMAIL,
  GREETING_INFO,
  GREETINGS,
  WISH,
} from './messages';
import { navigate } from '../../utils/navigate';
import { renderPageWithHeader } from '../../utils/dom';

const links = [
  { text: 'Пісенник', onClick: () => navigate(PAGES.CATEGORIES) },
  ...textConfigs,
];

export default async () => {
  const isAuth = isLoggedIn();
  const userName = getUserName();

  const container = Div({
    className: 'container',
  });

  const callToAction = Paragraph({
    text: CALL_TO_ACTION,
  });
  if (!isAuth) {
    callToAction.append(
      document.createTextNode(CALL_TO_ACTION_YOU_NEED_TO),
      Span({
        text: CALL_TO_ACTION_REGISTER,
        className: 'link',
        onClick: () => navigate(PAGES.AUTH + '?tab=signup'),
      }),
      document.createTextNode('.')
    );
  }

  const callToMail = Paragraph({
    className: 'italic center',
    text: CALL_TO_MAIL,
  });
  const emailLink = Span({
    text: EMAIL,
    className: 'link',
    onClick: () => window.open(`mailto:${EMAIL}`),
  });
  callToMail.appendChild(emailLink);

  const cards = Div();
  links.forEach(link => {
    const card = Div({
      className: 'card link',
      text: link.text,
      onClick: link.onClick,
    });
    cards.appendChild(card);
  });

  container.append(
    Header1({
      text: GREETINGS(isAuth ? `, ${userName}` : ''),
    }),
    Paragraph({
      text: GREETING_INFO,
    }),
    callToAction,
    Paragraph({
      text: WISH,
    }),
    cards,
    callToMail
  );

  renderPageWithHeader(undefined, container);
};

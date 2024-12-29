import { PAGES } from '../../constants';
import { Header, Header1, Div, Paragraph, Span } from '../../components';
import { isLoggedIn } from '../../features/auth';
import { navigate } from '../../utils/navigate';
import { getUserName } from '../../state/user';

const links = [
  { href: PAGES.CATEGORIES, text: 'Пісенник' },
  { href: PAGES.LITURGY, text: 'Літургія' },
  { href: PAGES.PANAKHYDA, text: 'Панахида' },
];

export default async () => {
  const isAuth = isLoggedIn();
  const userName = getUserName();

  const container = Div({
    className: 'container',
  });

  const callToAction = Paragraph({
    text: `Також Ви можете докластися до спільної справи, додаючи нові пісні та категорії в пісенник. `,
  });
  if (!isAuth) {
    callToAction.append(
      document.createTextNode('Для цього Вам потрібно '),
      Span({
        text: 'зареєструватися',
        className: 'link',
        onClick: () => navigate(PAGES.AUTH),
      }),
      document.createTextNode('.')
    );
  }

  const callToMail = Paragraph({
    className: 'italic',
    text: 'Якщо у Вас є питання або пропозиції, пишіть на пошту: ',
  });
  const emailLink = Span({
    text: 'liubomyr.mysak14@gmail.com',
    className: 'link',
    onClick: () => window.open('mailto:liubomyr.mysak14@gmail.com'),
  });
  callToMail.appendChild(emailLink);

  const cards = Div();
  links.forEach(link => {
    const card = Div({
      className: 'card link',
      text: link.text,
      onClick: () => navigate(link.href),
    });
    cards.appendChild(card);
  });

  container.append(
    Header1({
      text: `Вітаємо Вас на сайті${isAuth ? `, ${userName}` : ''}!`,
    }),
    Paragraph({
      text: 'Тут Ви можете знайти різні пісні, розділені по категоріях, текст Літургії св. Івана Золотоустого та текст Панахиди.',
    }),
    callToAction,
    Paragraph({
      text: 'Гарного перебування на сайті!',
    }),
    cards,
    callToMail
  );
  document.getElementById('root').append(Header(), container);
};

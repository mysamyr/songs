import { PAGES } from '../../constants';
import { Header, Button, Div, Paragraph, Header1 } from '../../components';
import { activate } from '../../api/auth';
import { navigate } from '../../utils/navigate';
import { isLoggedIn } from '../../features/auth';
import { getUser, saveUser } from '../../state/user';

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
      text: 'Перейти на головну',
      color: 'blue',
    })
  );

  activationContainer.appendChild(
    Header1({
      text: isActivated ? 'Вітаємо!' : 'Помилка при активації!',
    })
  );

  if (isActivated) {
    activationContainer.appendChild(
      Paragraph({
        text: 'Ви успішно активували обліковий запис і тепер можете створювати, редагувати та видаляти категорії та пісні.',
      })
    );
  } else {
    activationContainer.append(
      Paragraph({
        text: 'Ви не змогли активувати обліковий запис. Активуйте його перейшовши за посиланням, надісланим на Вашу електронну пошту, вказану при реєстрації.',
      }),
      Paragraph({
        text: "Якщо Ви не пам'ятаєте вказану електронну пошту чи виникли проблеми з активацією облікового запису - зверніться в адміністрацію пісенника.",
      })
    );
  }

  activationContainer.appendChild(buttons);

  document.getElementById('root').append(Header(), activationContainer);
};

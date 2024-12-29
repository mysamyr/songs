import { STATUS_CODES } from '../../constants';
import { Header, Header2, Div, Button, Paragraph } from '../../components';
import { navigateBack } from '../../utils/navigate';

export default () => {
  const { status } = window.history.state;

  let errorText;

  switch (status) {
    case STATUS_CODES.TOO_MANY_REQUESTS:
      errorText = 'Забагато запитів.';
      break;
    case STATUS_CODES.GATEWAY_TIMEOUT:
      errorText = 'Сервер наразі не може опрацювати Ваш запит.';
      break;
    default:
      errorText = 'Виникла неочікувана помилка.';
  }

  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'buttons_container',
  });
  buttons.append(
    Button({
      onClick: () => navigateBack(),
      text: 'Повернутися на головну',
      color: 'blue',
    })
  );

  container.append(
    Header2({
      text: errorText,
    }),
    Paragraph({
      text: 'Зачекайте, будь ласка, трохи і спробуйте знову.',
    }),
    buttons
  );

  document.getElementById('root').append(Header(), container);
};

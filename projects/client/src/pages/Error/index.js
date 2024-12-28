import { STATUS_CODES } from '../../constants';
import { Header, Header2, Div, Button } from '../../components';
import { navigateBack } from '../../utils/navigate';

export default async () => {
  const { status } = window.history.state;

  let errorText;

  switch (status) {
    case STATUS_CODES.TOO_MANY_REQUESTS:
      errorText = 'Too many requests.';
      break;
    case STATUS_CODES.GATEWAY_TIMEOUT:
      errorText = 'Server cannot handle your request.';
      break;
    default:
      errorText = 'Unexpected error occurred.';
  }

  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: () => navigateBack(),
      text: 'Back',
      color: 'blue',
    })
  );

  container.append(
    Header2({
      text: errorText,
    }),
    Header2({
      text: 'Please wait a little and try again.',
    }),
    buttons
  );

  document.getElementById('root').append(
    Header({
      title: 'Error',
    }),
    container
  );
};

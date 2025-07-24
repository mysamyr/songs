import { STATUS_CODES } from '../../constants';
import { BACK_HOME } from '../../constants/messages';
import { Button, Div, Header2, Paragraph } from '../../components';
import { navigateBack } from '../../utils/navigate';
import {
  GATEWAY_TIMEOUT,
  TITLE,
  TOO_MANY_REQUESTS,
  UNEXPECTED_ERROR,
  WAIT,
} from './messages';
import { renderPageWithHeader } from '../../utils/dom';

export default () => {
  const { status } = window.history.state;

  let errorText;

  switch (status) {
    case STATUS_CODES.TOO_MANY_REQUESTS:
      errorText = TOO_MANY_REQUESTS;
      break;
    case STATUS_CODES.GATEWAY_TIMEOUT:
      errorText = GATEWAY_TIMEOUT;
      break;
    default:
      errorText = UNEXPECTED_ERROR;
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
      text: BACK_HOME,
      color: 'blue',
    })
  );

  container.append(
    Header2({
      text: errorText,
    }),
    Paragraph({
      text: WAIT,
    }),
    buttons
  );

  renderPageWithHeader(TITLE, container);
};

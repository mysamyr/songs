import { Button, Div, Header3 } from '../';
import { hideModal } from '../../features/modal';

export default ({
  onConfirm,
  question,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  inverseColors = false,
}) => {
  const container = Div({
    className: 'container',
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      onClick: onConfirm,
      text: confirmText,
      color: inverseColors ? 'red' : 'green',
    }),
    Button({
      onClick: hideModal,
      text: cancelText,
      color: inverseColors ? 'green' : 'red',
    })
  );

  container.append(
    Header3({
      text: question,
    }),
    buttons
  );
  return container;
};

import { Button, Div, Paragraph } from '../';
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
    Paragraph({
      text: question,
    }),
    buttons
  );
  return container;
};

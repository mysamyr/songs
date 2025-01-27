import { Button, Div, Paragraph } from '../';
import { hideModal } from '../../features/modal';

export default ({
  onConfirm,
  question,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  inverseColors = false,
}) => {
  const container = Div({
    className: 'modal-content',
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
      className: 'modal-header',
    }),
    buttons
  );
  return container;
};

import { Div } from '../';

export default ({ msg, onClose }) => {
  const container = Div({
    className: 'snackbar-container',
  });

  container.append(
    Div({
      className: 'snackbar-label',
      text: msg,
    }),
    Div({
      className: 'snackbar-dismiss',
      text: '&times;',
      onClick: onClose,
    })
  );
  return container;
};

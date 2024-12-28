import { Div } from '../';

export default ({ msg, onClose }) => {
  const container = Div({
    className: 'snackbar_container',
  });

  container.append(
    Div({
      className: 'snackbar_label',
      text: msg,
    }),
    Div({
      className: 'snackbar_dismiss',
      text: '&times;',
      onClick: onClose,
    })
  );
  return container;
};

import { Div, Input } from '../';

export default ({ onSearch }) => {
  const container = Div({
    className: 'dropdown',
  });

  container.appendChild(
    Input({
      type: 'text',
      className: 'search',
      onChange: onSearch,
      focus: true,
    })
  );

  return container;
};

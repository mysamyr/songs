import { Div, Plus } from '../';

export default ({ onClick }) => {
  const div = Div({
    className: 'add-item',
    onClick,
  });

  div.appendChild(Plus());

  return div;
};

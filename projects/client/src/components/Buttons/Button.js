import { Input } from '../';

export default ({ onClick, text, color = '', type = 'button' }) =>
  Input({
    type,
    value: text,
    className: `btn ${color}`,
    onClick,
  });

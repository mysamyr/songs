import { panachyda } from './source';
import { Header, Div, ArrowUp } from '../../components';

export default () => {
  const container = Div({
    className: 'container',
    text: panachyda,
  });

  document.getElementById('root').append(Header(), container, ArrowUp());
};

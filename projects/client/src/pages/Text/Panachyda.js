import { panachyda } from './source';
import { ArrowUp, Div } from '../../components';
import { renderPageWithHeader } from '../../utils/dom';

export default () => {
  const container = Div({
    className: 'container',
    text: panachyda,
  });

  renderPageWithHeader(container, ArrowUp());
};

import { panachyda } from './source';
import { ArrowUpIcon, Div } from '../../components';
import { renderPageWithHeader } from '../../utils/dom';

export default () => {
  const container = Div({
    className: 'container',
    text: panachyda,
  });

  renderPageWithHeader('Панахида', container, ArrowUpIcon({}));
};

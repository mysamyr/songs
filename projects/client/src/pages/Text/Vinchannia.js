import { vinchannya } from './source';
import { ArrowUpIcon, Div } from '../../components';
import { renderPageWithHeader } from '../../utils/dom';

export default () => {
  const container = Div({
    className: 'container',
    text: vinchannya,
  });

  renderPageWithHeader('Вінчання', container, ArrowUpIcon({}));
};

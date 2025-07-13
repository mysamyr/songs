import { liturgy } from './source';
import { ArrowUpIcon, ComunionModal, Div } from '../../components';
import { showModal } from '../../features/modal';
import { renderPageWithHeader } from '../../utils/dom';

export default () => {
  const container = Div({
    className: 'container',
    text: liturgy,
  });

  renderPageWithHeader('Літургія', container, ArrowUpIcon({}));

  document.getElementById('modal').addEventListener('click', () => {
    showModal(ComunionModal());
  });
};

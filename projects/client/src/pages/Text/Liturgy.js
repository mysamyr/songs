import { liturgy } from './source';
import { Header, Div, ArrowUp, ComunionModal } from '../../components';
import { showModal } from '../../features/modal';

export default () => {
  const container = Div({
    className: 'container',
    text: liturgy,
  });

  document.getElementById('root').append(Header(), container, ArrowUp());

  document.getElementById('modal').addEventListener('click', () => {
    showModal(ComunionModal());
  });
};

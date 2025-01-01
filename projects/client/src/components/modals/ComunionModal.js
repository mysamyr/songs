import { Div, Header2, ListItem, OList } from '../.';
import { hideModal } from '../../features/modal';
import communionList from '../../constants/communion';

export default () => {
  const container = Div({
    className: 'modal-content',
    onClick: hideModal,
  });

  const header = Header2({
    text: 'Причасні',
    className: 'modal-header',
  });

  const list = OList();

  communionList.forEach(item => {
    list.append(
      ListItem({
        text: item,
      })
    );
  });

  container.append(header, list);

  return container;
};

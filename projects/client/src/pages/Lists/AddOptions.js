import { Div } from '../../components';
import { navigate } from '../../utils/navigate';
import { PAGES } from '../../constants';
import { hideModal } from '../../features/modal';

export default ({ id }) => {
  const onAddList = () => {
    hideModal();
    navigate(PAGES.NEW_LIST, { type: 'list', id });
  };

  const onAddListItem = () => {
    hideModal();
    navigate(PAGES.NEW_LIST, { type: 'list-item', id });
  };

  const container = Div({
    className: 'container',
  });

  container.append(
    Div({
      onClick: onAddList,
      text: 'Add new List',
    }),
    Div({
      onClick: onAddListItem,
      text: 'Add new List Item',
    })
  );

  return container;
};

import { HEADER_ICONS, PAGES } from '../../constants';
import { Header } from '../../components';
import AddList from './AddList';
import AddListItem from './AddListItem';
import { getListData } from '../../state';
import { navigate } from '../../utils/navigate';

export default async () => {
  const { id, type } = window.history.state;
  const listData = getListData();

  if ((type === 'list-item' && !listData.id) || (type === 'list' && !id)) {
    return navigate(PAGES.LISTS);
  }

  document.getElementById('root').append(
    Header({
      title: type === 'list-item' ? 'Add List Item' : 'Add List',
      leftContent: HEADER_ICONS.BACK,
    }),
    type === 'list-item' ? AddListItem(id) : await AddList(id)
  );
};

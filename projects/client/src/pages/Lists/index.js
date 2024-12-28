import {
  Header,
  AddButton,
  Breadcrumbs,
  Paragraph,
  ListItem,
  Div,
} from '../../components';
import AddOptions from './AddOptions';
import ListOptions from './ListOptions';
import { HEADER_ICONS, PAGES, SORT_DIRECTIONS } from '../../constants';
import { navigate } from '../../utils/navigate';
import { hideModal, showModal } from '../../features/modal';
import {
  getListData,
  getListItems,
  getLists,
  setLists,
  setListsData,
  sortLists,
  updateListItem,
} from '../../state';
import {
  getLists as getListsAPI,
  getRootLists,
  updateListItem as updateListItemAPI,
} from '../../api/lists';
import Snackbar from '../../features/snackbar';
import { getQueryParam, setQueryParam } from '../../utils/query-params';
import { logError } from '../../utils/helpers';

const ListContent = ({ lists, listItems, listData, listId }) => {
  if (!lists.length && !listItems.length) {
    return [Paragraph({ text: 'No items' })];
  }

  const onClickList = data => {
    navigate(PAGES.LIST(data.id));
  };

  const onClickListItem = data => {
    navigate(PAGES.LIST_ITEM_DATA(listId, data.id));
  };

  const onClickListOptions = (e, { id, name, config }) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(ListOptions({ id, name, isList: true, isTodo: config.todo }));
  };

  const onClickListItemOptions = (e, { id, data }) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(ListOptions({ id, name: data[0], isList: false }));
  };

  const onChangeTodo = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    const done = !listItems.find(item => item.id === itemId).done;

    try {
      await updateListItemAPI(listId, itemId, { done });
      updateListItem({ id: itemId, done });
      e.target.checked = !e.target.checked;
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  return [
    ...lists.map(item =>
      ListItem({
        key: item.id,
        data: item,
        name: item.name,
        className: 'list',
        onClickListItem: onClickList,
        onClickOptions: onClickListOptions,
      })
    ),
    ...listItems.map(item =>
      ListItem({
        key: item.id,
        data: item,
        name: item.data[0],
        className: 'list list-item',
        onClickListItem,
        onClickOptions: onClickListItemOptions,
        onChangeTodo,
        renderTodo: listData.config?.todo,
      })
    ),
  ];
};

export default async () => {
  const listId = window.location.pathname.split('/')[2];

  try {
    const func = listId ? getListsAPI : getRootLists;
    const data = await func(listId);
    if (!data) {
      return;
    }
    setLists(data);
    setListsData(data);
    const sort = getQueryParam('sort');
    if (sort) {
      sortLists({
        sort,
        direction: getQueryParam('direction') || SORT_DIRECTIONS.ASC,
      });
    }
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }

  const listData = getListData();
  const lists = getLists();
  const listItems = getListItems();

  const onClickAdd = () => {
    if (!listId) return navigate(PAGES.NEW_LIST, {});
    showModal(AddOptions({ id: listId }));
  };

  const onSort = e => {
    e.preventDefault();
    const sort = e.target.sort.value;
    const direction = e.target.direction.value;

    setQueryParam('sort', sort);
    setQueryParam('direction', direction);

    sortLists({ sort, direction });

    document.querySelectorAll('.list').forEach(e => e.remove());
    document.querySelector('.margin-bottom').before(
      ...ListContent({
        lists: getLists(),
        listItems: getListItems(),
        listData,
        listId,
      })
    );

    hideModal();
  };

  const root = document.getElementById('root');
  root.appendChild(
    Header({
      title: listData.name || 'Lists',
      leftContent: listId ? HEADER_ICONS.BACK : HEADER_ICONS.MENU,
      rightContent: listId ? HEADER_ICONS.SORT : '',
      onClick: onSort,
    })
  );
  if (listId) {
    root.appendChild(Breadcrumbs());
  }
  root.append(
    ...ListContent({ lists, listItems, listData, listId }),
    Div({
      className: 'margin-bottom',
    }),
    AddButton({
      onClick: onClickAdd,
    })
  );
};

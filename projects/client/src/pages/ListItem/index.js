import { Header } from '../../components';
import { HEADER_ICONS } from '../../constants';
import {
  getListData,
  getListItems,
  getParentData,
  setListsData,
  updateListData,
} from '../../state';
import { getListItemValuesFromForm, logError } from '../../utils/helpers';
import {
  getListItemData,
  updateListItem as updateListItemAPI,
} from '../../api/lists';
import Snackbar from '../../features/snackbar';
import DisplayForm from './DisplayForm';
import EditForm from './EditForm';

const getListIds = () => {
  const [, , listId, , listItemId] = window.location.pathname.split('/');
  return [listId, listItemId];
};

export default async () => {
  const [listId, listItemId] = getListIds();
  let isEdit = false;

  try {
    const parentData = getListData();
    const storedListItem = getListItems().find(i => i.id === listItemId);

    if (storedListItem) {
      setListsData({
        parentData,
        listData: storedListItem,
      });
    } else {
      const data = await getListItemData(listId, listItemId);
      if (!data) {
        return;
      }
      setListsData(data);
    }
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }

  const listData = getListData();
  const { config } = getParentData();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const fields = getListItemValuesFromForm(config.fields, e.target);
      await updateListItemAPI(listId, listItemId, { data: fields });
      updateListData({ ...listData, data: fields });
      isEdit = false;
      const { data } = getListData();
      document.querySelector('.container').remove();
      document
        .getElementById('root')
        .appendChild(DisplayForm({ data, fields: config.fields }));
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
  };

  const onCancel = () => {
    isEdit = false;
    document.querySelector('.container').remove();
    document
      .getElementById('root')
      .appendChild(DisplayForm({ data: listData.data, fields: config.fields }));
  };

  const onClickEdit = () => {
    isEdit = !isEdit;
    document.querySelector('.container').remove();
    document.getElementById('root').appendChild(
      isEdit
        ? EditForm({
            data: listData.data,
            fields: config.fields,
            onSubmit,
            onCancel,
          })
        : DisplayForm({ data: listData.data, fields: config.fields })
    );
  };

  document.getElementById('root').append(
    Header({
      title: listData.data[0],
      leftContent: HEADER_ICONS.BACK,
      rightContent: HEADER_ICONS.EDIT,
      onClick: onClickEdit,
      onCancel,
    }),
    DisplayForm({ data: listData.data, fields: config.fields })
  );
};

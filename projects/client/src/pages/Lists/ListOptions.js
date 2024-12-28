import {
  Div,
  RenameModal,
  DeleteModal,
  MoveModal,
  ClearCompletedModal,
} from '../../components';
import {
  clearCompletedList,
  deleteList as deleteListAPI,
  deleteListItem as deleteListItemAPI,
  getListTree,
  updateList,
  updateListItem as updateListItemAPI,
} from '../../api/lists';
import { hideModal, showModal } from '../../features/modal';
import { logError, validateName } from '../../utils/helpers';
import Snackbar from '../../features/snackbar';
import {
  NO_DESTINATION_LISTS,
  SAME_NAME,
} from '../../constants/error-messages';
import {
  deleteList,
  deleteListItem,
  getListData,
  getListItems,
  renameList,
  updateListItem,
} from '../../state';

const prepareDataForRename = (id, name, listItems) => {
  const listItem = listItems.find(i => i.id === id);
  return [name, ...listItem.data.slice(1)];
};

export default ({ id, name, isList, isTodo }) => {
  const { id: parentId } = getListData();

  const onRename = async e => {
    e.preventDefault();
    const newName = e.target.name.value;
    const err = validateName(newName);
    if (err) return Snackbar.displayMsg(err);
    if (name === newName) return Snackbar.displayMsg(SAME_NAME);
    try {
      if (isList) {
        await updateList(id, { name: newName });
        renameList({ id, name: newName });
        Snackbar.displayMsg('List was renamed');
      } else {
        const listItems = getListItems();
        const dataForUpdate = prepareDataForRename(id, newName, listItems);
        await updateListItemAPI(parentId, id, { data: dataForUpdate });
        updateListItem({ id, data: dataForUpdate });
        document.querySelector(`#li${id} span`).innerText = newName;
        Snackbar.displayMsg('List item was renamed');
      }
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const onDelete = async e => {
    e.preventDefault();
    try {
      if (isList) {
        await deleteListAPI(id);
        deleteList({ id });
        Snackbar.displayMsg(`List ${name} was deleted`);
      } else {
        await deleteListItemAPI(parentId, id);
        deleteListItem({ id });
        Snackbar.displayMsg(`List item ${name} was deleted`);
      }
      document.querySelector(`#li${id}`).remove();
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const onClear = async e => {
    e.preventDefault();
    try {
      if (isList) {
        await clearCompletedList(id);
        Snackbar.displayMsg('Completed list items are cleared');
      }
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const onClickRename = () => {
    showModal(RenameModal({ name, onSubmit: onRename }));
  };
  const onClickDelete = () => {
    showModal(DeleteModal({ onSubmit: onDelete }));
  };
  const onClickMove = async () => {
    try {
      const tree = await getListTree(id);
      if (tree.length < 2) {
        hideModal();
        Snackbar.displayMsg(NO_DESTINATION_LISTS);
        return;
      }
      showModal(MoveModal({ id, tree }));
    } catch (e) {
      hideModal();
      Snackbar.displayMsg(e.message);
    }
  };
  const onClickClearCompleted = () => {
    showModal(ClearCompletedModal({ onSubmit: onClear }));
  };

  const container = Div({
    className: 'container',
  });

  container.append(
    Div({
      onClick: onClickRename,
      text: 'Rename',
    }),
    Div({
      onClick: onClickDelete,
      text: 'Delete',
    })
  );

  if (isList) {
    container.appendChild(
      Div({
        onClick: onClickMove,
        text: 'Move',
      })
    );
  }

  if (isTodo) {
    container.appendChild(
      Div({
        onClick: onClickClearCompleted,
        text: 'Clear completed',
      })
    );
  }

  return container;
};

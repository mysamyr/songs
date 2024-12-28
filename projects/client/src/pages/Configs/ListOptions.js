import { Div, RenameModal, DeleteModal } from '../../components';
import { hideModal, showModal } from '../../features/modal';
import Snackbar from '../../features/snackbar';
import { deleteConfig, renameConfig } from '../../state';
import {
  updateConfig,
  deleteConfig as deleteConfigAPI,
} from '../../api/configs';
import { logError, validateName } from '../../utils/helpers';

export default ({ id, name }) => {
  const onRename = async e => {
    e.preventDefault();
    const newName = e.target.name.value;
    const err = validateName(newName);
    if (err) return Snackbar.displayMsg(err);
    if (name === newName) return Snackbar.displayMsg("Name isn't changed");
    try {
      await updateConfig(id, { name: newName });
      renameConfig({ id, name: newName });
      document.querySelector(`#li${id} span`).innerText = newName;
      Snackbar.displayMsg('Config was renamed');
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const onDelete = async e => {
    e.preventDefault();
    try {
      await deleteConfigAPI(id);
      deleteConfig({ id });
      document.querySelector(`#li${id}`).remove();
      Snackbar.displayMsg(`Config ${name} was deleted`);
    } catch (e) {
      Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const onClickRename = () =>
    showModal(
      RenameModal({
        name,
        onSubmit: onRename,
      })
    );

  const onClickDelete = () =>
    showModal(
      DeleteModal({
        onSubmit: onDelete,
      })
    );

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

  return container;
};

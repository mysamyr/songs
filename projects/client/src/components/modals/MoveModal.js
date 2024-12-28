import { Button, Radio, Div, Paragraph, Form } from '../';
import { deleteList, getListData } from '../../state';
import { moveList } from '../../api/lists';
import Snackbar from '../../features/snackbar';
import { hideModal } from '../../features/modal';
import { logError } from '../../utils/helpers';

const destinationInputs = (checkRoot, tree) => [
  Radio({
    value: '',
    name: 'destination',
    description: 'root',
    checked: checkRoot,
  }),
  ...tree.map((item, idx) => {
    const input = Radio({
      value: item.id,
      name: 'destination',
      description: item.name,
      checked: !checkRoot && !idx,
    });
    input.style.marginLeft = item.lvl * 20 + 'px';
    return input;
  }),
];

export default ({ id, tree }) => {
  const { id: parentId } = getListData();

  const onSubmit = async e => {
    e.preventDefault();
    const destination = e.target.destination.value;
    try {
      await moveList(id, { destination });
      deleteList({ id });
      Snackbar.displayMsg('List was moved');
      document.querySelector(`#li${id}`).remove();
    } catch (e) {
      logError(e);
      return Snackbar.displayMsg(e.message);
    }
    hideModal();
  };

  const form = Form({
    className: 'container',
    onSubmit,
  });

  const inputs = Div({
    className: 'column',
  });
  inputs.append(...destinationInputs(!!parentId, tree));

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Move',
      color: 'green',
    }),
    Button({
      onClick: hideModal,
      text: 'Cancel',
      color: 'red',
    })
  );

  form.append(
    Paragraph({
      text: 'Select destination list:',
    }),
    inputs,
    buttons
  );

  return form;
};

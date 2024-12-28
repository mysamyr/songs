import { Div, Span, Input } from '../';

export default ({
  data,
  name,
  className,
  hideOptions,
  renderTodo,
  onClickListItem,
  onChangeTodo,
  onClickOptions,
}) => {
  const container = Div({
    id: 'li' + data.id,
    className,
    onClick: () => onClickListItem(data),
  });
  const leftBlock = Div();
  if (renderTodo) {
    leftBlock.appendChild(
      Input({
        type: 'checkbox',
        checked: data.done,
        onClick: e => onChangeTodo(e, data.id),
      })
    );
  }
  leftBlock.appendChild(
    Span({
      text: name,
    })
  );
  container.appendChild(leftBlock);
  if (!hideOptions) {
    container.appendChild(
      Div({
        text: '︙',
        onClick: e => onClickOptions(e, data),
      })
    );
  }
  return container;
};

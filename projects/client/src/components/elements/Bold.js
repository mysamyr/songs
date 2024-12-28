import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {function} [props.onClick]
 * @returns {HTMLElement}
 * */
export default props => {
  const b = document.createElement('b');
  if (!props) return b;
  if (props.className) b.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) b.innerHTML = props.text;
  if (props.id) b.id = props.id;
  if (props.onClick) b.addEventListener('click', props.onClick);

  return b;
};

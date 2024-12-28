import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {function} [props.onClick]
 * @returns {HTMLDivElement}
 * */
export default props => {
  const div = document.createElement('div');
  if (!props) return div;
  if (props.className) div.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) div.innerHTML = props.text;
  if (props.id) div.id = props.id;
  if (props.onClick) div.addEventListener('click', props.onClick);

  return div;
};

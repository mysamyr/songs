import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.text]
 * @param {function} [props.onClick]
 * @returns {HTMLLIElement}
 * */
export default props => {
  const li = document.createElement('li');
  if (!props) return li;
  if (props.className)
    li.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) li.innerHTML = props.text;
  if (props.id) li.id = props.id;
  if (props.onClick) li.addEventListener('click', props.onClick);

  return li;
};

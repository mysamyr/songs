import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {function} [props.onClick]
 * @returns {HTMLSpanElement}
 * */
export default props => {
  const span = document.createElement('span');
  if (!props) return span;
  if (props.className)
    span.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) span.innerHTML = props.text;
  if (props.id) span.id = props.id;
  if (props.onClick) span.addEventListener('click', props.onClick);

  return span;
};

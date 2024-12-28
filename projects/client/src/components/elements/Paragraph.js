import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {function} [props.onClick]
 * @returns {HTMLParagraphElement}
 * */
export default props => {
  const p = document.createElement('p');
  if (!props) return p;
  if (props.className) p.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) p.innerHTML = props.text;
  if (props.id) p.id = props.id;
  if (props.onClick) p.addEventListener('click', props.onClick);

  return p;
};

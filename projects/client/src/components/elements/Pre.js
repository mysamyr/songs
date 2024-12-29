import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLPreElement}
 * */
export default props => {
  const pre = document.createElement('pre');
  if (!props) return pre;
  if (props.className) pre.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) pre.innerHTML = props.text;
  if (props.id) pre.id = props.id;

  return pre;
};

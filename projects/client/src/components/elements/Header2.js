import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLHeadingElement}
 * */
export default props => {
  const h2 = document.createElement('h2');
  if (!props) return h2;
  if (props.className) h2.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) h2.innerHTML = props.text;
  if (props.id) h2.id = props.id;

  return h2;
};

import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLHeadingElement}
 * */
export default props => {
  const h1 = document.createElement('h1');
  if (!props) return h1;
  if (props.className)
    h1.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) h1.innerHTML = props.text;
  if (props.id) h1.id = props.id;

  return h1;
};

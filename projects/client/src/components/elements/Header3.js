import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLHeadingElement}
 * */
export default props => {
  const h3 = document.createElement('h3');
  if (!props) return h3;
  if (props.className)
    h3.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) h3.innerHTML = props.text;
  if (props.id) h3.id = props.id;

  return h3;
};

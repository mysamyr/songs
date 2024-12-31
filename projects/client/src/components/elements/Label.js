import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLLabelElement}
 * */
export default props => {
  const label = document.createElement('label');
  if (!props) return label;
  if (props.className)
    label.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) label.innerHTML = props.text;
  if (props.id) label.id = props.id;

  return label;
};

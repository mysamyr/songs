import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.text]
 * @param {string} [props.value]
 * @param {boolean} [props.selected]
 * @returns {HTMLOptionElement}
 * */
export default props => {
  const option = document.createElement('option');
  if (!props) return option;
  if (!isNil(props.text)) option.innerHTML = props.text;
  if (props.value) option.value = props.value;
  option.selected = props.selected;

  return option;
};

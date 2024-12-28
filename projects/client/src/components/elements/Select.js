/* eslint-disable no-prototype-builtins */
import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {function} [props.onChange]
 * @returns {HTMLSelectElement}
 * */
export default props => {
  const select = document.createElement('select');
  if (!props) return select;
  if (props.className) select.classList.add(...props.className.split(' '));
  if (props.id) select.id = props.id;
  if (props.name) select.name = props.name;
  if (!isNil(props.value)) select.value = props.value;
  if (props.hasOwnProperty('required')) select.required = props.required;
  if (props.hasOwnProperty('disabled')) select.disabled = props.disabled;
  if (props.onChange) select.addEventListener('change', props.onChange);

  return select;
};

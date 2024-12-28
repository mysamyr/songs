/* eslint-disable no-prototype-builtins */
import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.type]
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {string} [props.placeholder]
 * @param {string} [props.step]
 * @param {boolean} [props.checked]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.focus]
 * @param {function} [props.onClick]
 * @param {function} [props.onChange]
 * @returns {HTMLInputElement}
 * */
export default props => {
  const input = document.createElement('input');
  input.type = props?.type || 'text';
  if (!props) return input;
  if (props.className) input.classList.add(...props.className.split(' '));
  if (props.id) input.id = props.id;
  if (props.name) input.name = props.name;
  if (!isNil(props.value)) input.value = props.value;
  if (props.placeholder) input.placeholder = props.placeholder;
  if (props.step) input.step = props.step;
  if (props.hasOwnProperty('checked')) input.checked = props.checked;
  if (props.hasOwnProperty('required')) input.required = props.required;
  if (props.hasOwnProperty('disabled')) input.disabled = props.disabled;
  if (props.focus)
    setTimeout(() => {
      input.focus();
    }, 0);
  if (props.onClick) input.addEventListener('click', props.onClick);
  if (props.onChange) input.addEventListener('change', props.onChange);

  return input;
};

import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.type]
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {number} [props.min]
 * @param {number} [props.max]
 * @param {string} [props.placeholder]
 * @param {string} [props.step]
 * @param {boolean} [props.checked]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.focus]
 * @param {function} [props.onEnter]
 * @param {function} [props.onClick]
 * @param {function} [props.onChange]
 * @returns {HTMLInputElement}
 * */
export default props => {
  const input = document.createElement('input');
  input.type = props?.type || 'text';
  if (!props) return input;
  if (props.className)
    input.classList.add(...props.className.split(' ').filter(Boolean));
  if (props.id) input.id = props.id;
  if (props.name) input.name = props.name;
  if (!isNil(props.value)) input.value = props.value;
  if (props.min) {
    if (input.type === 'number') {
      input.min = `${props.min}`;
    } else {
      input.minLength = props.min;
    }
  }
  if (props.max) {
    if (input.type === 'number') {
      input.max = `${props.max}`;
    } else {
      input.maxLength = props.max;
    }
  }
  if (props.placeholder) input.placeholder = props.placeholder;
  if (props.step) input.step = props.step;
  input.checked = !!props.checked;
  input.required = !!props.required;
  input.disabled = !!props.disabled;
  if (props.focus)
    setTimeout(() => {
      input.focus();
    }, 0);
  if (props.onEnter)
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') props.onEnter(e);
    });
  if (props.onClick) input.addEventListener('click', props.onClick);
  if (props.onChange) input.addEventListener('keyup', props.onChange);

  return input;
};

import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {number} [props.min]
 * @param {number} [props.max]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.focus]
 * @param {function} [props.onClick]
 * @param {function} [props.onChange]
 * @returns {HTMLTextAreaElement}
 * */
export default props => {
  const textarea = document.createElement('textarea');
  if (!props) return textarea;
  if (props.className)
    textarea.classList.add(...props.className.split(' ').filter(Boolean));
  if (props.id) textarea.id = props.id;
  if (props.name) textarea.name = props.name;
  if (!isNil(props.value)) textarea.value = props.value;
  if (props.min) textarea.maxLength = props.min;
  if (props.max) textarea.maxLength = props.max;
  if (props.placeholder) textarea.placeholder = props.placeholder;
  textarea.required = !!props.required;
  textarea.disabled = !!props.disabled;
  if (props.focus)
    setTimeout(() => {
      textarea.focus();
    }, 0);
  if (props.onClick) textarea.addEventListener('click', props.onClick);
  if (props.onChange) textarea.addEventListener('change', props.onChange);

  return textarea;
};

import { isNil } from '../../utils/helpers';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {function} [props.onSubmit]
 * @returns {HTMLFormElement}
 * */
export default props => {
  const form = document.createElement('form');
  if (!props) return form;
  if (props.className) form.classList.add(...props.className.split(' '));
  if (!isNil(props.text)) form.innerHTML = props.text;
  if (props.id) form.id = props.id;
  if (props.onSubmit) form.addEventListener('submit', props.onSubmit);

  return form;
};

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @returns {HTMLUListElement}
 * */
export default props => {
  const ul = document.createElement('ul');
  if (!props) return ul;
  if (props.className)
    ul.classList.add(...props.className.split(' ').filter(Boolean));
  if (props.id) ul.id = props.id;

  return ul;
};

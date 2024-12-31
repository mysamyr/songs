/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @returns {HTMLOListElement}
 * */
export default props => {
  const ol = document.createElement('ol');
  if (!props) return ol;
  if (props.className)
    ol.classList.add(...props.className.split(' ').filter(Boolean));
  if (props.id) ol.id = props.id;

  return ol;
};

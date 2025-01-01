import { Line } from './common';

/**
 * @param {Object} [props]
 * @param {string} [props.color]
 * @param {string} [props.className]
 * @param {function} [props.onClick]
 * @returns {SVGElement}
 * */
export default ({ color = 'var(--black)', className, onClick }) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'menu';
  if (className) svg.classList.add(...className.split(' ').filter(Boolean));
  if (onClick) svg.addEventListener('click', onClick);
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.append(
    Line('4', '4', '20', '20', color, 3),
    Line('4', '20', '20', '4', color, 3)
  );
  return svg;
};

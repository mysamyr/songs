import { Path } from './common';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * @param {Object} [props]
 * @param {string} [props.color]
 * @param {string} [props.className]
 * @param {function} [props.onClick]
 * @returns {SVGElement}
 * */
export default ({
  color = 'var(--light-green)',
  className = 'arr-top',
  onClick = scrollToTop,
}) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'arr-top';
  if (className) svg.classList.add(...className.split(' ').filter(Boolean));
  if (onClick) svg.addEventListener('click', onClick);
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.appendChild(
    Path({
      d: 'M12 4 L6 12 H10.5 V20 H13.5 V12 H18 L12 4 Z',
      fill: color,
    })
  );
  return svg;
};

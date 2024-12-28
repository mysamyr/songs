import { Polyline } from './common';

export default (color = 'var(--white)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'back';
  svg.setAttribute('width', '12');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 12 24');
  svg.appendChild(Polyline('10 2 2 12 10 22', color));
  return svg;
};

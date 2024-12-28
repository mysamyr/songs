import { Path } from './common';

export default (color = 'var(--white)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'plus';
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.appendChild(
    Path({
      d: 'M2 16H30M16 2V30',
      fill: 'none',
      stroke: color,
      strokeWidth: '6',
      strokeLineCap: 'round',
      strokeLinejoin: 'round',
    })
  );
  return svg;
};

import { Line } from './common';

export default (color = 'var(--white)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'menu';
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 20');
  svg.append(
    Line('2', '2', '22', '2', color),
    Line('2', '10', '22', '10', color),
    Line('2', '18', '22', '18', color)
  );
  return svg;
};

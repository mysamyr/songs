import { Line } from './common';

export default (color = 'var(--white)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'sort';
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 20');
  svg.append(
    Line('2', '2', '22', '2', color),
    Line('6', '10', '18', '10', color),
    Line('9', '18', '15', '18', color)
  );
  return svg;
};

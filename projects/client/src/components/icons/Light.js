import { Path } from './common';

export default (color = 'var(--secondary)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'light';
  svg.setAttribute('width', '36');
  svg.setAttribute('height', '36');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.appendChild(
    Path({
      d: 'M12 1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1ZM12 19a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM1 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM19 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM7.047 16.953a1 1 0 0 1 0 1.414l-1.41 1.41a1 1 0 1 1-1.414-1.414l1.41-1.41a1 1 0 0 1 1.414 0ZM19.777 4.223a1 1 0 0 1 0 1.414l-1.41 1.41a1 1 0 1 1-1.414-1.414l1.41-1.41a1 1 0 0 1 1.414 0ZM16.953 16.953a1 1 0 0 1 1.414 0l1.41 1.41a1 1 0 1 1-1.414 1.414l-1.41-1.41a1 1 0 0 1 0-1.414ZM4.223 4.223a1 1 0 0 1 1.414 0l1.41 1.41a1 1 0 0 1-1.414 1.414l-1.41-1.41a1 1 0 0 1 0-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
      fill: color,
    })
  );
  return svg;
};

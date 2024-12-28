import { Path } from './common';

export default (color = 'var(--secondary)') => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'dark';
  svg.setAttribute('width', '36');
  svg.setAttribute('height', '36');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.appendChild(
    Path({
      d: 'M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z',
      fill: 'none',
      stroke: color,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
    })
  );
  return svg;
};

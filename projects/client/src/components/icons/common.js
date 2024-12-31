export const Line = (x1, y1, x2, y2, color) => {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-miterlimit', '10');
  line.setAttribute('stroke-width', '4');
  return line;
};

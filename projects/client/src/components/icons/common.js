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

export const Polyline = (points, color) => {
  const polyline = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polyline'
  );
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', color);
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  polyline.setAttribute('stroke-width', '4');
  return polyline;
};

export const Path = ({
  d,
  fill,
  stroke,
  strokeLineCap,
  strokeLinejoin,
  strokeWidth,
}) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  if (fill) path.setAttribute('fill', fill);
  if (stroke) path.setAttribute('stroke', stroke);
  if (strokeLineCap) path.setAttribute('stroke-linecap', strokeLineCap);
  if (strokeLinejoin) path.setAttribute('stroke-linejoin', strokeLinejoin);
  if (strokeWidth) path.setAttribute('stroke-width', strokeWidth);
  return path;
};

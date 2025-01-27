import { Div } from '../.';

export default () =>
  Div({
    className: 'arr-top',
    text: '🡡',
    onClick: () =>
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      }),
  });

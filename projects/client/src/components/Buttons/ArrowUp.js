import { Div } from '../.';

export default () =>
  Div({
    className: 'arr_top',
    text: '🡡',
    onClick: () =>
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      }),
  });

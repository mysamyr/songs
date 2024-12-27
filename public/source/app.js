import { PAGES } from './constants.js';
import { flashTimer, sideNav, define } from './helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  if (define(PAGES.LITURGY) || define(PAGES.PANAKHYDA)) {
    import('./pages/text.js').then(module => {
      module.default();
    });
  }
  if (define(PAGES.AUTH)) {
    import('./pages/authorisation.js').then(module => {
      module.default();
    });
  }
  if (define(PAGES.CABINET)) {
    import('./pages/cabinet.js').then(module => {
      module.default();
    });
  }
  if (define(PAGES.CATEGORY)) {
    import('./pages/category.js').then(module => {
      module.default();
    });
  }

  sideNav();
  flashTimer();
});

import router from './router';
import { initModal } from './features/modal';
import { PAGES } from './constants';
import { navigateBack } from './utils/navigate';
import { clearPage } from './utils/dom';

document.addEventListener('DOMContentLoaded', () => {
  initModal();

  router(window.location.pathname);

  // on click back
  window.addEventListener('popstate', () => {
    if (window.location.pathname === PAGES.ERROR) {
      navigateBack();
      return;
    }
    clearPage();
    document.querySelector('dialog').close();
    router(window.location.pathname);
  });
});

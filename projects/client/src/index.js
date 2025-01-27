import router from './router';
import { initModal } from './features/modal';
import { PAGES } from './constants';
import { navigateBack } from './utils/navigate';

document.addEventListener('DOMContentLoaded', () => {
  initModal();

  router(window.location.pathname);

  // on click back
  window.addEventListener('popstate', () => {
    if (window.location.pathname === PAGES.ERROR) {
      navigateBack();
      return;
    }
    document.getElementById('root').innerText = '';
    document.querySelector('dialog').close();
    router(window.location.pathname);
  });
});

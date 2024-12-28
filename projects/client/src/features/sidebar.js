import { Div, Sidebar } from '../components';

export const openSidebar = () => {
  const backdrop = Div({
    id: 'backdrop',
    className: 'backdrop',
    onClick: e => {
      if (e.target.className === 'backdrop') {
        closeSidebar();
      }
    },
  });
  backdrop.appendChild(Sidebar());
  document.getElementById('root').appendChild(backdrop);
};

export const closeSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.remove('slide-in');
  sidebar.classList.add('slide-out');
  setTimeout(() => {
    document.getElementById('backdrop').remove();
  }, 250);
};

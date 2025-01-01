import { Cancel, Div } from '../';
import Dropdown from './Dropdown';
import { navigate } from '../../utils/navigate';

export default ({ container, onSearch }) => {
  const searchContainer = Div({
    className: 'link',
    onClick: () => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        // clear search input and results
        navigate(window.location.pathname);
      } else {
        searchContainer.innerText = '';
        searchContainer.appendChild(Cancel({}));
        const dropdown = Dropdown({
          onSearch,
        });
        const containerDimensions = searchContainer.getBoundingClientRect();
        dropdown.style.top = `${containerDimensions.bottom}px`;
        dropdown.style.left = `${containerDimensions.right - 181}px`;
        container.after(dropdown);
      }
    },
  });
  return searchContainer;
};

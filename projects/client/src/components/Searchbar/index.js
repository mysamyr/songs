import { Cancel, Div, Search } from '../';
import Dropdown from './Dropdown';

export default ({ container, onSearch }) => {
  const searchContainer = Div({
    className: 'link',
    onClick: () => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        searchContainer.innerText = '';
        searchContainer.appendChild(Search({}));
        dropdown.remove();
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

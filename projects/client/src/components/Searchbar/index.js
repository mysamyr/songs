import { CancelIcon, SearchIcon, Div } from '../';
import Dropdown from './Dropdown';

export default ({ container, onSearch, onClose }) => {
  const searchContainer = Div({
    className: 'link',
    onClick: () => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        onClose();
        document.querySelector('.dropdown').remove();
        searchContainer.innerText = '';
        searchContainer.appendChild(SearchIcon({}));
      } else {
        searchContainer.innerText = '';
        searchContainer.appendChild(CancelIcon({}));
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

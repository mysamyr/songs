import { SearchIcon, Div, Input } from '../';

export default ({ value, onSearch }) => {
  const container = Div({
    className: 'searchbar',
  });
  const input = Input({
    type: 'text',
    placeholder: 'Search songs...',
    value,
    className: 'search-input',
    onEnter: e => onSearch(e.target.value),
  });

  const searchBtn = Div({
    className: 'search-btn',
    onClick: () => onSearch(input.value),
  });
  searchBtn.appendChild(SearchIcon({}));

  container.append(input, searchBtn);

  return container;
};

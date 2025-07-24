import { Header } from '../components';

export const clearPage = () => {
  document.getElementById('root').innerText = '';
};

export const renderPageWithHeader = (title = 'Пісенник', ...components) => {
  document.title = title;
  document.getElementById('root').append(Header(), ...components);
};

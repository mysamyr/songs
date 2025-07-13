import { Header } from '../components';

export const clearPage = () => {
  document.getElementById('root').innerText = '';
};

export const renderPageWithHeader = (...components) => {
  document.getElementById('root').append(Header(), ...components);
};

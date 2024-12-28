import { PAGES } from '../../constants';
import { Bold, Div, Paragraph } from '../';
import { clearLists, getListData, getParentData } from '../../state';
import { navigate } from '../../utils/navigate';

const Link = ({ name, isActive, onClick }) => {
  const onClickLink = () => {
    onClick && onClick();
  };

  const element = Paragraph({
    onClick: onClickLink,
  });

  if (isActive) {
    element.appendChild(Bold({ text: name }));
  } else {
    element.innerText = name;
  }

  return element;
};

export default () => {
  const parentData = getParentData();
  const listData = getListData();
  const onClickHomeLink = () => {
    clearLists();
    navigate(PAGES.LISTS);
  };
  const onClickBreadcrumbsLink = () => {
    clearLists();
    navigate(PAGES.LIST(parentData.id));
  };

  const container = Div({
    className: 'breadcrumbs',
  });
  container.appendChild(Link({ name: 'Home', onClick: onClickHomeLink }));
  if (parentData.id) {
    container.appendChild(
      Paragraph({
        text: parentData.parent ? '&#8230;' : '&#65125;',
      })
    );
    const linkContainer = Div({
      className: 'breadcrumb-item',
    });
    linkContainer.appendChild(
      Link({
        name: parentData.name?.slice(0, 9),
        onClick: onClickBreadcrumbsLink,
      })
    );
    container.appendChild(linkContainer);
  }
  if (listData.id) {
    const linkContainer = Div({
      className: 'breadcrumb-item',
    });
    linkContainer.append(
      Paragraph({
        text: '&#65125;',
      }),
      Link({ name: listData.name?.slice(0, 9), isActive: true })
    );
    container.appendChild(linkContainer);
  }

  return container;
};

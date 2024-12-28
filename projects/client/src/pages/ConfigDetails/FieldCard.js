import { FIELD_TYPE_NAMES, FIELD_TYPES } from '../../constants';
import { isNil } from '../../utils/helpers';
import { Div, Paragraph, Span } from '../../components';

export default ({ description, type, min, max }) => {
  let bgColor;
  switch (type) {
    case FIELD_TYPES.NUMBER:
      bgColor = 'bg-blue';
      break;
    case FIELD_TYPES.BOOLEAN:
      bgColor = 'bg-yellow';
      break;
    default:
      bgColor = 'bg-green';
  }

  const renderMinMax = !isNil(min) || !isNil(max);

  const container = Div({
    className: 'card ' + bgColor,
  });

  const cardRow = Div({
    className: 'card-row',
  });
  cardRow.append(
    Paragraph({
      className: 'card-text',
      text: description,
    }),
    Paragraph({
      className: 'card-text',
      text: FIELD_TYPE_NAMES[type],
    })
  );

  container.appendChild(cardRow);

  if (renderMinMax) {
    const minMaxRow = Div({
      className: 'row',
    });
    minMaxRow.append(
      Span({
        className: 'card-text',
        text: isNil(min) ? '\u2300' : min,
      }),
      Span({
        className: 'card-text',
        text: ' - ',
      }),
      Span({
        className: 'card-text',
        text: isNil(max) ? '\u2300' : max,
      })
    );
    container.appendChild(minMaxRow);
  }

  return container;
};

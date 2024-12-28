import { Div, Span } from '../../components';
import { FIELD_TYPES } from '../../constants';

export default ({ data, fields }) => {
  const container = Div({
    className: 'container',
  });

  container.append(
    ...fields.map((field, idx) => {
      const row = Div({
        className: 'row',
      });

      row.append(
        Span({
          className: 'bold',
          text: `${field.description}:`,
        }),
        Span({
          text:
            field.type !== FIELD_TYPES.BOOLEAN
              ? data[idx]
              : data[idx]
                ? '+'
                : '-',
        })
      );

      return row;
    })
  );

  return container;
};

import { FIELD_TYPES } from '../../constants';
import { Form, Label, Span, Input, Div, Button } from '../../components';

export default ({ data, fields, onSubmit, onCancel }) => {
  const form = Form({
    className: 'container',
    onSubmit,
  });

  const inputs = fields.map((field, idx) => {
    const container = Label({
      className: 'row',
    });
    if (field.type === FIELD_TYPES.BOOLEAN) {
      container.append(
        Span({
          text: field.description,
        }),
        Input({
          name: `${idx}`,
          type: 'checkbox',
          checked: data[idx],
        })
      );
    } else {
      container.append(
        Span({
          text: field.description,
        }),
        Input({
          name: `${idx}`,
          type: field.type === FIELD_TYPES.STRING ? 'text' : 'number',
          value: data[idx],
          focus: !idx,
          step: field.type === FIELD_TYPES.NUMBER ? '0.1' : null,
        })
      );
    }
    return container;
  });

  const buttons = Div({
    className: 'btns',
  });
  buttons.append(
    Button({
      type: 'submit',
      text: 'Save',
      color: 'green',
    }),
    Button({
      onClick: onCancel,
      text: 'Cancel',
      color: 'red',
    })
  );

  form.append(...inputs, buttons);

  return form;
};

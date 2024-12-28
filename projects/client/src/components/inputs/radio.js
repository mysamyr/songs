import { Label, Span, Input } from '../';

export default ({ value, name, description, checked }) => {
  const label = Label();

  label.append(
    Input({
      type: 'radio',
      name,
      value,
      checked,
    }),
    Span({
      text: description,
    })
  );
  return label;
};

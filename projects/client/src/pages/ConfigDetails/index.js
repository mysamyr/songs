import { Header, Div, Span } from '../../components';
import { HEADER_ICONS } from '../../constants';
import { getConfigData, getConfigs, setConfigData } from '../../state';
import { getConfigData as getConfigDataAPI } from '../../api/configs';
import FieldCard from './FieldCard';
import Snackbar from '../../features/snackbar';
import { logError } from '../../utils/helpers';

const FieldsContainer = fields => {
  const fieldsContainer = Div({
    className: 'column',
  });

  fieldsContainer.append(
    ...fields.map(({ description, type, min, max }) =>
      FieldCard({
        description,
        type,
        min,
        max,
      })
    )
  );

  return fieldsContainer;
};

export default async () => {
  const configId = window.location.pathname.split('/')[2];

  try {
    const storedConfig = getConfigs().find(item => item.id === configId);
    if (storedConfig) {
      setConfigData(storedConfig);
    } else {
      const configData = await getConfigDataAPI(configId);
      if (!configData) {
        return;
      }
      setConfigData(configData);
    }
  } catch (e) {
    logError(e);
    return Snackbar.displayMsg(e.message);
  }
  const { fields, name, todo, unique, sort } = getConfigData();

  const container = Div({
    className: 'container',
  });
  const nameRow = Div({
    className: 'row',
  });
  nameRow.append(
    Span({
      className: 'bold',
      text: 'Name:',
    }),
    Span({
      text: name,
    })
  );
  const sortByRow = Div({
    className: 'row',
  });
  sortByRow.append(
    Span({
      className: 'bold',
      text: 'Sort by:',
    }),
    Span({
      text: fields && fields[sort].description,
    })
  );

  container.append(nameRow, sortByRow);

  if (todo) {
    container.appendChild(
      Span({
        className: 'bold',
        text: 'Config handles as To-Do',
      })
    );
  }

  if (unique) {
    container.appendChild(
      Span({
        className: 'bold',
        text: 'Config name is unique',
      })
    );
  }
  container.appendChild(FieldsContainer(fields));

  document.getElementById('root').append(
    Header({
      title: name,
      leftContent: HEADER_ICONS.BACK,
    }),
    container
  );
};

import { sortByValue } from '../utils/helpers';

const state = {
  lists: [],
  listItems: [],
  parentData: {},
  listData: {},
  configs: [],
  configData: {},
};
// Lists
export const setLists = ({ lists = [], listItems = [] }) => {
  state.lists = lists;
  state.listItems = listItems;
};
export const setListsData = ({ parentData = {}, listData = {} }) => {
  state.parentData = parentData;
  state.listData = listData;
};
export const updateListData = listData => {
  state.listData = listData;
};
export const renameList = ({ id, name }) => {
  const idx = state.lists.findIndex(item => item.id === id);
  const renamedList = { ...state.lists[idx], name };
  state.lists = [
    ...state.lists.slice(0, idx),
    renamedList,
    ...state.lists.slice(idx + 1),
  ];
};
export const updateListItem = payload => {
  const idx = state.listItems.findIndex(item => item.id === payload.id);
  state.listItems = [
    ...state.listItems.slice(0, idx),
    {
      ...state.listItems[idx],
      ...payload,
    },
    ...state.listItems.slice(idx + 1),
  ];
};
export const sortLists = ({ sort, direction }) => {
  const { lists, listItems } = sortByValue({
    lists: state.lists,
    listItems: state.listItems,
    sort,
    direction,
  });
  state.lists = lists;
  state.listItems = listItems;
};
export const deleteList = ({ id }) => {
  const idx = state.lists.findIndex(item => item.id === id);
  state.lists = [...state.lists.slice(0, idx), ...state.lists.slice(idx + 1)];
};
export const deleteListItem = ({ id }) => {
  const idx = state.listItems.findIndex(item => item.id === id);
  state.listItems = [
    ...state.listItems.slice(0, idx),
    ...state.listItems.slice(idx + 1),
  ];
};
export const clearLists = () => {
  state.lists = [];
  state.listItems = [];
  state.parentData = {};
  state.listData = {};
};
// Configs
export const setConfigs = configs => {
  state.configs = configs;
};
export const setConfigData = configData => {
  state.configData = configData;
};
export const renameConfig = ({ id, name }) => {
  const idx = state.configs.findIndex(item => item.id === id);
  const renamedConfig = { ...state.configs[idx], name };
  state.configs = [
    ...state.configs.slice(0, idx),
    renamedConfig,
    ...state.configs.slice(idx + 1),
  ];
};
export const deleteConfig = ({ id }) => {
  const idx = state.configs.findIndex(item => item.id === id);
  state.configs = [
    ...state.configs.slice(0, idx),
    ...state.configs.slice(idx + 1),
  ];
};
export const clearConfigs = () => {
  state.configs = [];
  state.configData = {};
};

export const getLists = () => state.lists;
export const getListItems = () => state.listItems;
export const getParentData = () => state.parentData;
export const getListData = () => state.listData;

export const getConfigs = () => state.configs;
export const getConfigData = () => state.configData;

export const clearState = () => {
  state.lists = [];
  state.listItems = [];
  state.parentData = {};
  state.listData = {};
  state.configs = [];
  state.configData = {};
};

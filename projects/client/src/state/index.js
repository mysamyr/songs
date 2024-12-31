const state = {
  categories: [],
  category: {},
  song: null,
};

// Categories
export const getCategories = () => state.categories;
export const setCategories = categories => {
  state.categories = categories;
};

export const getCategory = () => state.category;
export const setCategory = category => {
  state.category = category;
};

export const getSong = () => state.song;
export const setSong = song => {
  state.song = song;
};

export const clearState = () => {
  state.categories = [];
  state.category = {};
  state.songs = [];
  state.song = null;
};

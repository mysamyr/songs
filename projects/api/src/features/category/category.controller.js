import STATUS_CODES from '../../constants/status-codes.js';
import {
  EXISTING_CATEGORY,
  SONGS_INSIDE_CATEGORY,
  NO_SUCH_CATEGORY,
  SAME_CATEGORY,
  NOT_AUTHOR,
} from '../../constants/error-messages.js';
import { Category, Song } from '../../models/index.js';
import { mapCategories, mapCategoryWithSongs } from './category.helper.js';
import ApiError from '../../utils/error.js';

export const getCategories = async (req, res) => {
  // todo add pagination
  const categories = await Category.find().select('id name').exec();

  return res.status(STATUS_CODES.OK).json(mapCategories(categories));
};

export const getSongsForCategory = async (req, res) => {
  const {
    params: { id },
  } = req;
  const dbCategory = await Category.findOne({
    _id: id,
  })
    .select('id name author')
    .exec();

  if (!dbCategory) {
    throw new ApiError.BadRequest(NO_SUCH_CATEGORY);
  }

  const songs = await Song.find({
    categories: id,
    deleted: false,
  })
    .select('name id')
    .exec();

  return res
    .status(STATUS_CODES.OK)
    .json(mapCategoryWithSongs(dbCategory, songs));
};

export const addCategory = async (req, res) => {
  const {
    body: { name },
    userData,
  } = req;

  const isCategoryNameExists = await Category.findOne({ name }).exec();
  if (isCategoryNameExists) {
    throw new ApiError.BadRequest(EXISTING_CATEGORY);
  }

  await Category.create({
    name,
    author: userData._id,
  });

  return res.status(STATUS_CODES.CREATED).send();
};

// todo change new value to new name
export const renameCategory = async (req, res) => {
  const {
    body: { prevName, newName },
    params: { id },
    userData,
  } = req;

  if (prevName === newName) {
    throw new ApiError.BadRequest(SAME_CATEGORY);
  }

  const category = await Category.findById(id).exec();
  if (!category) {
    throw new ApiError.BadRequest(NO_SUCH_CATEGORY);
  }
  const isNewNameNotUnique = await Category.findOne({ name: newName }).exec();
  if (isNewNameNotUnique) {
    throw new ApiError.BadRequest(EXISTING_CATEGORY);
  }
  if (
    category.author.toString() !== userData._id.toString() &&
    !userData.is_admin
  ) {
    throw new ApiError.BadRequest(NOT_AUTHOR);
  }

  await Category.findByIdAndUpdate(id, {
    name: newName,
    author: userData._id,
  });

  return res.status(STATUS_CODES.OK).send();
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const isCategoryNotEmpty = await Song.findOne({
    categories: id,
    deleted: false,
  }).exec();

  if (isCategoryNotEmpty) {
    throw new ApiError.BadRequest(SONGS_INSIDE_CATEGORY);
  }
  await Category.findOneAndDelete({
    _id: id,
  });

  return res.status(STATUS_CODES.OK).send();
};

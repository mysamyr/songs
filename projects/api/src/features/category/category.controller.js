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
import { BadRequest } from '../../utils/error.js';

export const getCategories = async (req, res) => {
  // todo add pagination
  const categories = await Category.find().select('id name').exec();

  return res.status(STATUS_CODES.OK).json(mapCategories(categories));
};

export const getCategory = async (req, res) => {
  const {
    params: { id },
  } = req;
  const dbCategory = await Category.findOne({
    _id: id,
  })
    .select('id name author')
    .exec();

  if (!dbCategory) {
    throw BadRequest(NO_SUCH_CATEGORY);
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
    throw BadRequest(EXISTING_CATEGORY);
  }

  await Category.create({
    name,
    author: userData._id,
  });

  return res.status(STATUS_CODES.CREATED).send();
};

export const renameCategory = async (req, res) => {
  const {
    body: { prevName, newName },
    params: { id },
    userData,
  } = req;

  if (prevName === newName) {
    throw BadRequest(SAME_CATEGORY);
  }

  const category = await Category.findById(id).exec();
  if (!category) {
    throw BadRequest(NO_SUCH_CATEGORY);
  }
  const isNewNameNotUnique = await Category.findOne({ name: newName }).exec();
  if (isNewNameNotUnique) {
    throw BadRequest(EXISTING_CATEGORY);
  }
  if (
    category.author.toString() !== userData._id.toString() &&
    !userData.is_admin
  ) {
    throw BadRequest(NOT_AUTHOR);
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
    throw BadRequest(SONGS_INSIDE_CATEGORY);
  }
  await Category.findOneAndDelete({
    _id: id,
  });

  return res.status(STATUS_CODES.OK).send();
};

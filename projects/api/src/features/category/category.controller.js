import STATUS_CODES from '../../constants/status-codes.js';
import {
  EXISTING_CATEGORY,
  SONGS_INSIDE_CATEGORY,
  NO_SUCH_CATEGORY,
} from '../../constants/error-messages.js';
import { Category, Song } from '../../models/index.js';
import { mapCategories, mapCategoryWithSongs } from './category.helper.js';
import { BadRequest } from '../../utils/error.js';

export const getCategories = async (req, res) => {
  // todo add pagination
  const categories = await Category.find().select('name').exec();

  return res.status(STATUS_CODES.OK).json(mapCategories(categories));
};

export const getCategory = async (req, res) => {
  const {
    params: { id },
  } = req;
  const dbCategory = await Category.findOne({
    _id: id,
  })
    .select('name author')
    .exec();

  if (!dbCategory) {
    throw BadRequest(NO_SUCH_CATEGORY);
  }

  const songs = await Song.find({
    categories: id,
    deleted: false,
  })
    .select('name')
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

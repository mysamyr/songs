import STATUS_CODES from '../../constants/status-codes.js';
import {
  EXISTING_CATEGORY,
  SONGS_INSIDE_CATEGORY,
  NO_SUCH_CATEGORY,
  NOT_AUTHOR,
} from '../../constants/error-messages.js';
import { Category, Song } from '../../models/index.js';
import { mapCategories, mapCategoryWithSongs } from './category.helper.js';
import { BadRequest } from '../../utils/error.js';

export const getCategories = async (req, res) => {
  const {
    query: { skip, limit },
  } = req;

  const categories = limit
    ? await Category.find()
        .skip(skip)
        .limit(limit)
        .select('name')
        .sort('name')
        .exec()
    : await Category.find().select('name').exec();

  return res.status(STATUS_CODES.OK).json(mapCategories(categories));
};

export const getCategory = async (req, res) => {
  const {
    params: { id },
    query: { skip, limit },
  } = req;

  const dbCategory = await Category.findOne({ _id: id })
    .select('name author')
    .exec();

  if (!dbCategory) {
    throw BadRequest(NO_SUCH_CATEGORY);
  }

  const songs = limit
    ? await Song.find({
        categories: id,
        deleted: false,
      })
        .select('name')
        .skip(skip)
        .limit(limit)
        .sort('name')
        .exec()
    : await Song.find({
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

export const renameCategory = async (req, res) => {
  const {
    body: { name },
    params: { id },
    userData,
  } = req;

  const category = await Category.findById(id).exec();
  if (!category) {
    throw BadRequest(NO_SUCH_CATEGORY);
  }
  const isNewNameNotUnique = await Category.findOne({ name }).exec();
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
    name,
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

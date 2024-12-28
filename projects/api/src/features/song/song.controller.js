import STATUS_CODES from '../../constants/status-codes.js';
import {
  DELETED_CATEGORY,
  EXISTING_SONG,
  NOT_EXISTING_SONG,
  NOT_AUTHOR,
  EXISTING_CATEGORY,
} from '../../constants/error-messages.js';
import { Category, Song } from '../../models/index.js';
import { mapSong } from './song.helper.js';
import ApiError from '../../utils/error.js';

export const getSong = async (req, res) => {
  const {
    params: { id },
  } = req;

  const song = await Song.findById(id)
    .select('id name text')
    .populate('author', 'id name')
    .exec();
  if (!song) {
    throw new ApiError.BadRequest(NOT_EXISTING_SONG);
  }

  return res.status(STATUS_CODES.OK).json(mapSong(song));
};

export const addSong = async (req, res) => {
  const {
    body: { categories, name, text },
    userData,
  } = req;
  const catArray = Array.isArray(categories) ? categories : [categories];

  const dbCategories = await Category.find({ name: catArray })
    .select('id name')
    .exec();
  if (!dbCategories.length || catArray.length !== dbCategories.length) {
    throw new ApiError.BadRequest(EXISTING_CATEGORY);
  }

  const isSongExist = await Song.findOne({
    name,
    deleted: false,
  });
  if (isSongExist) {
    throw new ApiError.BadRequest(EXISTING_SONG);
  }

  await Song.create({
    name,
    text,
    author: userData._id,
    categories: dbCategories.map(i => i._id),
  });

  return res.status(STATUS_CODES.CREATED).send();
};

export const editSong = async (req, res) => {
  const {
    params: { id },
    body: { categories, name, text },
    userData,
  } = req;

  const catArray = Array.isArray(categories) ? categories : [categories];

  const dbCategories = await Category.find({ name: catArray })
    .select('id')
    .exec();
  if (!dbCategories.length || catArray.length !== dbCategories.length) {
    throw new ApiError.BadRequest(DELETED_CATEGORY);
  }

  await Song.findOneAndUpdate(
    { _id: id },
    {
      name,
      text,
      author: userData._id,
      categories: dbCategories.map(c => c._id),
    }
  );

  return res.status(STATUS_CODES.OK).send();
};

export const deleteSong = async (req, res) => {
  const {
    params: { id },
    userData,
  } = req;

  const song = await Song.findOne({ _id: id }).exec();
  if (!song) {
    throw new ApiError.BadRequest(NOT_EXISTING_SONG);
  }
  if (
    !userData.is_admin &&
    userData._id.toString() !== song.author.toString()
  ) {
    throw new ApiError.BadRequest(NOT_AUTHOR);
  }

  await Song.findByIdAndUpdate(id, {
    deleted: true,
    deleted_at: new Date(),
  });

  return res.status(STATUS_CODES.OK).send();
};

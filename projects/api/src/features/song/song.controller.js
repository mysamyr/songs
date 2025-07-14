import STATUS_CODES from '../../constants/status-codes.js';
import {
  DELETED_CATEGORY,
  EXISTING_SONG,
  NOT_EXISTING_SONG,
  NOT_AUTHOR,
} from '../../constants/error-messages.js';
import { Category, Song } from '../../models/index.js';
import { mapSong } from './song.helper.js';
import { BadRequest } from '../../utils/error.js';
import { mapCategoryWithSongs } from '../category/category.helper.js';

export const getAllSongs = async (req, res) => {
  const {
    query: { skip, limit, search },
  } = req;

  const songs = await Song.find({
    deleted: false,
    ...(search ? { name: new RegExp(search, 'i') } : {}),
  })
    .select('name text')
    .populate('author', 'name')
    .populate('categories', '_id')
    .skip(skip)
    .limit(limit)
    .sort('name')
    .exec();

  return res.status(STATUS_CODES.OK).json(
    mapCategoryWithSongs(
      {
        name: 'Всі пісні',
        _id: 'all',
      },
      songs
    )
  );
};

export const getSong = async (req, res) => {
  const {
    params: { id },
    userData,
  } = req;

  const song = await Song.findById(id)
    .select('name text')
    .populate('author', 'name')
    .populate('categories', '_id')
    .exec();
  if (!song) {
    throw BadRequest(NOT_EXISTING_SONG);
  }

  return res.status(STATUS_CODES.OK).json(mapSong(song, userData));
};

export const addSong = async (req, res) => {
  const {
    body: { categories, name, text },
    userData,
  } = req;
  const catArray = Array.isArray(categories) ? categories : [categories];

  const dbCategories = await Category.find({ _id: catArray })
    .select('name')
    .exec();
  if (!dbCategories.length || catArray.length !== dbCategories.length) {
    throw BadRequest(DELETED_CATEGORY);
  }

  const isSongExist = await Song.findOne({
    name,
    deleted: false,
  });
  if (isSongExist) {
    throw BadRequest(EXISTING_SONG);
  }

  const song = await Song.create({
    name,
    text,
    author: userData._id,
    categories: dbCategories.map(i => i._id),
  });

  return res.status(STATUS_CODES.CREATED).json({ id: song._id.toString() });
};

export const editSong = async (req, res) => {
  const {
    params: { id },
    body: { categories, name, text },
    userData,
  } = req;

  const catArray = Array.isArray(categories) ? categories : [categories];

  const dbCategories = await Category.find({ _id: catArray }).exec();
  if (!dbCategories.length || catArray.length !== dbCategories.length) {
    throw BadRequest(DELETED_CATEGORY);
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
    throw BadRequest(NOT_EXISTING_SONG);
  }
  if (
    !userData.is_admin &&
    userData._id.toString() !== song.author.toString()
  ) {
    throw BadRequest(NOT_AUTHOR);
  }

  if (!song.deleted) {
    await Song.findByIdAndUpdate(id, {
      deleted: true,
      deleted_at: new Date(),
    });
  }

  return res.status(STATUS_CODES.OK).send();
};

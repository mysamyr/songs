import { Schema, model } from 'mongoose';
import { COLLECTIONS } from '../constants/index.js';

const songSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USER,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: COLLECTIONS.CATEGORY,
        },
      ],
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: new Date(),
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: 'song',
  }
);

export default model(COLLECTIONS.SONG, songSchema);

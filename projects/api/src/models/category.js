import { Schema, model } from 'mongoose';
import { COLLECTIONS } from '../constants/index.js';

const categorySchema = new Schema(
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
    created_at: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    collection: 'category',
  }
);

export default model(COLLECTIONS.CATEGORY, categorySchema);

import { Schema, model } from 'mongoose';
import { COLLECTIONS } from '../constants/index.js';

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  collection: 'token',
};

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user_id: {
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
  opts
);

export default model(COLLECTIONS.TOKEN, tokenSchema);

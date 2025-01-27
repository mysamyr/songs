import { Schema, model } from 'mongoose';
import { COLLECTIONS } from '../constants/index.js';

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
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
    collection: 'token',
  }
);

export default model(COLLECTIONS.TOKEN, tokenSchema);

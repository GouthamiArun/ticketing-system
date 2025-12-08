import mongoose, { Schema, Document } from 'mongoose';
import { TYPE } from '../config/constants';

export interface ICategory extends Document {
  name: string;
  type: typeof TYPE[keyof typeof TYPE];
  subcategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(TYPE),
      required: [true, 'Type is required'],
    },
    subcategories: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
categorySchema.index({ type: 1, isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);

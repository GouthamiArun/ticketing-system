import { createBaseDAO } from './base.dao';
import { Category, ICategory } from '../models/Category.model';

const baseDAO = createBaseDAO<ICategory>(Category);

export const findByType = async (type: string): Promise<ICategory[]> => {
  return await baseDAO.findAll({ type, isActive: true });
};

export const findByName = async (name: string, type: string): Promise<ICategory | null> => {
  return await baseDAO.findOne({ name, type });
};

export const addSubcategory = async (categoryId: string, subcategory: string): Promise<ICategory | null> => {
  const category = await Category.findById(categoryId);
  if (!category) return null;

  if (!category.subcategories.includes(subcategory)) {
    category.subcategories.push(subcategory);
    await category.save();
  }

  return category;
};

export const removeSubcategory = async (categoryId: string, subcategory: string): Promise<ICategory | null> => {
  const category = await Category.findById(categoryId);
  if (!category) return null;

  category.subcategories = category.subcategories.filter((sub) => sub !== subcategory);
  await category.save();

  return category;
};

export const getActiveCategories = async (): Promise<ICategory[]> => {
  return await baseDAO.findAll({ isActive: true }, { sort: { type: 1, name: 1 } });
};

export const categoryDAO = {
  ...baseDAO,
  findByType,
  findByName,
  addSubcategory,
  removeSubcategory,
  getActiveCategories,
};

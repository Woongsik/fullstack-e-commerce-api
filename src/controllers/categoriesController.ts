import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import categoriesService from '../services/categoriesService';
import CategoryModel, { CategoryDocument } from '../model/CategoryModel';
import {
  ApiError,
  BadRequest,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../errors/ApiError';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories: CategoryDocument[] = await categoriesService.getAllCategories();
    if (categories && categories.length > 0) {
      return res.status(200).json(categories);
    }

    throw new NotFoundError('No categories found');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong format to get categories'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to find the categories'));
  }
};

export const getCategoryById = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const categoryId: string = req.params.categoryId;
    const category: CategoryDocument | null = await categoriesService.getCategoryById(categoryId);
    if (category) {
      return res.status(200).json(category);
    }

    throw new NotFoundError('No matched category with the id');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong id to find category'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to find category'));
  }
};

export const createCategory = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const newData: CategoryDocument = new CategoryModel(req.body);
    const newCategory: CategoryDocument = await categoriesService.createCategory(newData);
    if (newCategory) {
      return res.status(201).json(newCategory);
    }

    throw new ForbiddenError('Creating category is not allowed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data to create category'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to create category'));
  }
};

export const updateCategory = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const categoryId = req.params.categoryId as string;
    const newData = req.body as Partial<CategoryDocument>;
    const newCategory = await categoriesService.updateCategory(categoryId, newData);
    if (newCategory) {
      return res.status(200).json(newCategory);
    }

    throw new ForbiddenError('Update category is not allowed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data to udpate category'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to update category'));
  }
};

export const deleteCategory = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.categoryId as string;
    const newCategory: CategoryDocument | null = await categoriesService.deleteCategoryById(categoryId);
    if (newCategory) {
      return res.status(204).json();
    }

    throw new ForbiddenError('Delete category is not allowed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data to delete category'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unkown error ouccured to delete the category'));
  }
};

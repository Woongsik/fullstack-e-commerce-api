import { InternalServerError, NotFoundError } from "../errors/ApiError";
import CategoryModel, { CategoryDocument } from "../model/CategoryModel";

const getAllCategories = async (): Promise<CategoryDocument[]> => {
  const categories: CategoryDocument[] = await CategoryModel.find();
  if (categories && categories.length > 0) {
    return categories;
  }
  
  throw new NotFoundError('No categories found'); 
}

const getCategoryById = async (categoryId: string): Promise<CategoryDocument> => {
  const category: CategoryDocument | null = await CategoryModel.findById(categoryId);
  if (category) {
    return category;
  }

  throw new NotFoundError('No matched category with the id');
}

const createCategory = async (category: CategoryDocument): Promise<CategoryDocument> => {
  const newCategory: CategoryDocument | null = await category.save();
  if (newCategory) {
    return newCategory;
  }

  throw new InternalServerError('Cannot create a new category in db');
}
 
const updateCategory = async (categoryId: string, newData: Partial<CategoryDocument>): Promise<CategoryDocument> => {
  const udpatedCategory: CategoryDocument | null = await CategoryModel.findByIdAndUpdate(categoryId, newData, {
    new: true
  });

  if (udpatedCategory) {
    return udpatedCategory;
  }

  throw new InternalServerError('Cannot update a new category in db');
}

const deleteCategoryById = async (categoryId: string): Promise<CategoryDocument> => {
  const deletedCategory: CategoryDocument | null = await CategoryModel.findByIdAndDelete(categoryId);
  if (deletedCategory) {
    return deletedCategory;
  }

  throw new InternalServerError('Cannot delete the category in db');
}

export default { 
  getAllCategories, 
  getCategoryById ,
  createCategory,
  updateCategory,
  deleteCategoryById
};  
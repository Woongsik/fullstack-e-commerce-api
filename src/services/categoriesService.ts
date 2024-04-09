import CategoryModel, { CategoryDocument } from "../model/CategoryModel";

const getAllCategories = async (): Promise<CategoryDocument[]> => {
  return await CategoryModel.find();
}

const getCategoryById = async (categoryId: string): Promise<CategoryDocument | null> => {
  return await CategoryModel.findById(categoryId);
}

const createCategory = async (category: CategoryDocument): Promise<CategoryDocument> => {
  return await category.save();
}
 
const updateCategory = async (categoryId: string, newData: Partial<CategoryDocument>): Promise<CategoryDocument | null> => {
  return await CategoryModel.findByIdAndUpdate(categoryId, newData, {
    new: true
  });
}

const deleteCategoryById = async (categoryId: string): Promise<CategoryDocument | null> => {
  return await CategoryModel.findByIdAndDelete(categoryId);
}

export default { 
  getAllCategories, 
  getCategoryById ,
  createCategory,
  updateCategory,
  deleteCategoryById
};  
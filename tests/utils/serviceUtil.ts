import { Category } from "../../src/misc/types/Category";
import CategoryModel, { CategoryDocument } from "../../src/model/CategoryModel";
import categoriesService from "../../src/services/categoriesService";
import { getCategoryData } from "./controllerUtil";


export const createCategoryInService = async (): Promise<CategoryDocument> => {
  const categoryInfo: Category = getCategoryData();
  const categoryDocument: CategoryDocument = new CategoryModel(categoryInfo);
  const newCategory: CategoryDocument = await categoriesService.createCategory(categoryDocument);

  return newCategory;
} 
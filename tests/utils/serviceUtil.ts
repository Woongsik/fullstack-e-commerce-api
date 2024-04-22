import { Category } from "../../src/misc/types/Category";
import { Product } from "../../src/misc/types/Product";
import CategoryModel, { CategoryDocument } from "../../src/model/CategoryModel";
import ProductModel, { ProductDocument } from "../../src/model/ProductModel";
import categoriesService from "../../src/services/categoriesService";
import productsService from "../../src/services/productsService";
import { getCategoryData, getProductData } from "./controllerUtil";


export const createCategoryInService = async (): Promise<CategoryDocument> => {
  const categoryInfo: Category = getCategoryData();
  const categoryDocument: CategoryDocument = new CategoryModel(categoryInfo);
  const newCategory: CategoryDocument = await categoriesService.createCategory(categoryDocument);

  return newCategory;
} 

export const createProductInService = async (): Promise<ProductDocument> => {
  const category: CategoryDocument = await createCategoryInService();
  const productInfo: Partial<Product> = getProductData(category._id);
  const newProduct: ProductDocument = new ProductModel(productInfo);
  
  return await productsService.createNewProduct(newProduct);
}
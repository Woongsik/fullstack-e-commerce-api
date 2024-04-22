import connect, { MongoHelper } from '../db-helper';

import categoriesService from '../../src/services/categoriesService';
import CategoryModel, { CategoryDocument } from '../../src/model/CategoryModel';
import { Category } from '../../src/misc/types/Category';
import { createCategoryWithAcessToken, getCategoryData } from '../utils/controllerUtil';
import { UserRole } from '../../src/misc/types/User';
import { createCategoryInService } from '../utils/serviceUtil';

describe('category service test', () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  it('should return a list of categories', async () => {
    const newCategory: CategoryDocument = await createCategoryInService();
    const categoryList = await categoriesService.getAllCategories();
    const matchedCategory: CategoryDocument = categoryList[0];

    expect(categoryList.length).toBe(1);
    expect(newCategory._id.toString()).toBe(matchedCategory._id.toString());
  });

  it('should return a category with categoryId', async () => {
    const category: CategoryDocument = await createCategoryInService();

    const foundCategory: CategoryDocument | null =
      await categoriesService.getCategoryById(category._id);

    expect(category._id.toString()).toBe(foundCategory._id.toString());
  });

  it('should create a category', async () => {
    const category: CategoryDocument = await createCategoryInService();

    expect(category).toHaveProperty('_id');
    expect(category).toHaveProperty('title');
    expect(category).toHaveProperty('image');
    expect(category).toHaveProperty('__v');
  });

  it('should update a category', async () => {
    const category: CategoryDocument = await createCategoryInService();
    const updateInfo: Partial<Category> = {
      title: 'updated name'
    };

    const updatedCategory: CategoryDocument | null =
      await categoriesService.updateCategory(category._id, updateInfo);
    
    expect(updatedCategory.title).toBe(updateInfo.title);
  });

  it('should delete a category', async () => {
    const category: CategoryDocument = await createCategoryInService();

    const deletedCategory: CategoryDocument | null = await categoriesService.deleteCategoryById(category._id);
    expect(deletedCategory._id.toString()).toBe(category._id.toString());
  });
});

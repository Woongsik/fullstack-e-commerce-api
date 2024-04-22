import connect, { MongoHelper } from '../db-helper';

import categoriesService from '../../src/services/categoriesService';
import { CategoryDocument } from '../../src/model/CategoryModel';
import { Category } from '../../src/misc/types/Category';
import { createCategoryWithAcessToken } from '../utils/testUtil';
import { UserRole } from '../../src/misc/types/User';

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
    const categoryRes = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryRes.body;

    const categoryList = await categoriesService.getAllCategories();
    const matchedCategory: CategoryDocument = categoryList[0];

    expect(categoryList.length).toEqual(1);
    expect(category._id).toBe(matchedCategory._id.toString());
  });

  it('should return a category with categoryId', async () => {
    const categoryRes = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryRes.body;

    const foundCategory: CategoryDocument | null =
      await categoriesService.getCategoryById(category._id);

    expect(category).toMatchObject({
      _id: category._id.toString(),
      title: category.title,
      image: category.image,
      __v: category.__v
    });
  });

  it('should create a category', async () => {
    const categoryRes = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryRes.body;
    
    expect(category).toHaveProperty('_id');
    expect(category).toHaveProperty('title');
    expect(category).toHaveProperty('image');
    expect(category).toHaveProperty('__v');
  });

  it('should update a category', async () => {
    const categoryRes = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryRes.body;
    
    const updateInfo: Partial<Category> = {
      title: 'updated name'
    };

    const updatedCategory: CategoryDocument | null =
      await categoriesService.updateCategory(category._id, updateInfo);
    
    expect(updatedCategory.title).toBe(updateInfo.title);
  });

  it('should delete a category', async () => {
    const categoryRes = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryRes.body;

    const deletedCategory: CategoryDocument | null = await categoriesService.deleteCategoryById(category._id);
    expect(deletedCategory._id.toString()).toBe(category._id);
  });
});

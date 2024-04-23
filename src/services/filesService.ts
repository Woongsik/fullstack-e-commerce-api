import dotenv from 'dotenv';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import { InternalServerError, NotFoundError } from "../errors/ApiError";
import CategoryModel, { CategoryDocument } from "../model/CategoryModel";

dotenv.config({ path: '.env' });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY as string,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET as string
});

const uploadFile = async (filePath: string): Promise<string> => {
  const uploadResponse: UploadApiResponse = await cloudinary.uploader.upload(filePath);
  if (uploadResponse) {
    return uploadResponse.url;
  }

  throw new InternalServerError('Cannot upload image');
}

const deleteFileById = async (imageId: string): Promise<CategoryDocument> => {
  const category: CategoryDocument | null = await CategoryModel.findById(imageId);
  if (category) {
    return category;
  }

  throw new NotFoundError('No matched category with the id');
}

export default { 
  uploadFile, 
  deleteFileById
};  
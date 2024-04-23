import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  ApiError,
  BadRequest,
  InternalServerError,
  NotFoundError
} from '../errors/ApiError';
import filesService from '../services/filesService';

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.file && req.file.path) {
      const uploadedUrl: string = await filesService.uploadFile(req.file.path);
      return res.status(200).json(uploadedUrl);      
    }

    throw new NotFoundError('No file passed');
  } catch (e) {
    console.log(e);
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to delete product by id'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
    
    return next(new InternalServerError('Unknown error, cannot delete product by id'));
  }
}


export async function deleteFileById(req: Request, res: Response, next: NextFunction) {
  try {
    const imageId: string = req.params.imageId as string;
    
    return res.sendStatus(204);
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to delete product by id'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
    
    return next(new InternalServerError('Unknown error, cannot delete product by id'));
  }
}
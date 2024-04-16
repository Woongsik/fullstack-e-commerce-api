import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import productsService from '../services/productsService';
import ProductModel, { ProductDocument } from '../model/ProductModel';
import {
  ApiError,
  BadRequest,
  InternalServerError
} from '../errors/ApiError';
import { FilterProduct, ProductsList } from '../misc/types/Product';
import { sortSizes } from './controllerUtil';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filterProduct: Partial<FilterProduct> = req.query;
    const productsList: ProductsList = await productsService.getAllProducts(filterProduct);
    
    return res.status(200).json(productsList);
  } catch (e) {
    console.log(e);
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Check the request to get the products'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot get products'));
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const productId: string = req.params.productId as string;
    const product: ProductDocument = await productsService.getProductById(productId);

    return res.status(200).json(product);
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to get product by id'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot get product by id'));
  }
}

export async function createNewProduct(req: Request,res: Response,next: NextFunction) {
  try {
    const { categoryId } = req.body;
    const productInfo: ProductDocument = new ProductModel(req.body);
    if (categoryId) {
      productInfo.category = categoryId;
    }
    if (productInfo.sizes) {
      productInfo.sizes = sortSizes(productInfo.sizes);
    }
    
    const newProduct: ProductDocument = await productsService.createNewProduct(productInfo);
    return res.status(201).json(newProduct);
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to create product'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot create product'));
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.body;
    const updateInfo: Partial<ProductDocument> = req.body;
    if (categoryId) {
      updateInfo.category = categoryId;
    }
    if (updateInfo.sizes) {
      updateInfo.sizes = sortSizes(updateInfo.sizes);
    }
    
    const updatedProduct: ProductDocument = await productsService.updateProduct(
      req.params.productId,
      updateInfo
    );

    return res.status(200).json(updatedProduct);
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to update product'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot update product'));
  }
}

export async function deleteProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const productId: string = req.params.productId;
    const deletedProduct: ProductDocument = await productsService.deleteProductById(productId);
    
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
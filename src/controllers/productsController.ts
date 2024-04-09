import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import productsService from '../services/productsService';
import ProductModel, { ProductDocument } from '../model/ProductModel';
import {
  ApiError,
  BadRequest,
  InternalServerError,
  NotFoundError,
} from '../errors/ApiError';
import { FilterProduct, ProductsList } from '../misc/types/Product';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filterProduct: Partial<FilterProduct> = req.query;
    const productsList: ProductsList = await productsService.getAllProducts(filterProduct);

    if (productsList && productsList.total !== 0) {
      return res.status(200).json(productsList);
    } 
    
    throw new NotFoundError('No matched products');
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Check the request to get the products'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot get products'));
  }
}

export async function createNewProduct(req: Request,res: Response,next: NextFunction) {
  try {
    const productInfo: ProductDocument = new ProductModel(req.body);
    const newProduct: ProductDocument | null = await productsService.createNewProduct(productInfo);
    if (newProduct) {
      return res.status(201).json(newProduct);
    }

    throw new InternalServerError('Unknow error when create new proudct');
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
    const newData: Partial<ProductDocument> = req.body;
    const updatedProduct: ProductDocument | null = await productsService.updateProduct(
      req.params.productId,
      newData
    );

    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    }

    throw new InternalServerError('Unknow error when update new proudct');
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to update product'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot update product'));
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = req.params.productId;
    const product: ProductDocument | null = await productsService.getProductById(productId);
    if (product) {
      return res.status(200).json(product);
    }

    throw new NotFoundError('No matched product with id');
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to get product by id'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
  
    return next(new InternalServerError('Unknown error, cannot get product by id'));
  }
}

export async function deleteProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = req.params.productId;
    const deletedProduct = await productsService.deleteProductById(productId);
    if (deletedProduct) {
      return res.sendStatus(204);
    }
    
    throw new InternalServerError('Unknown error when deleting product');
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong data format to delete product by id'));
    } else if (e instanceof ApiError) {
      return next(e)
    }
    
    return next(new InternalServerError('Unknown error, cannot delete product by id'));
  }
}
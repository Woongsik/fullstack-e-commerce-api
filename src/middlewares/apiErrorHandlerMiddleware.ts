import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';

function apiErrorhandler(error: ApiError, req: Request, res: Response, next: NextFunction) {
  console.log('error', error, error.message);
  if (!error.statusCode) {
    return res.status(500).json({ message: error.message ?? 'Internal server error' });
  }
  
  return res.status(error.statusCode).json({ message: error.message });
}

export default apiErrorhandler;

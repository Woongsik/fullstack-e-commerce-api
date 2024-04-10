import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';

import productsRouter from './routers/productsRouter';
import usersRouter from './routers/usersRouter';
import categoriesRouter from './routers/categoriesRouter';
import adminRouter from './routers/adminRouter';
import orderRouter from './routers/orderRouter';
import apiErrorhandler from './middlewares/apiErrorHandlerMiddleware';
import { googleStrategy, jwtStrategy } from './config/passport';

dotenv.config({ path: '.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleStrategy);

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/orders', orderRouter);

app.use(apiErrorhandler);
export default app;

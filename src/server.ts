import mongoose from 'mongoose';

import app from './app';

const mongodb_url = process.env.MONGODB_URL as string;
const PORT = process.env.PORT as string;

mongoose
  .connect(mongodb_url, {
    dbName: 'fullstack',
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log('MongoDB connected');
      console.log(`Server running at... http://localhost:${PORT}`);
    });
  })
  .catch((e: Error) => {
    console.log('MongoDB connection error', e);
    process.exit(1);
  });

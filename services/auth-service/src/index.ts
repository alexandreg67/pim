import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/database';
import { authRoutes } from './routes/auth.routes';

dotenv.config();

async function startServer() {
  const app = express();

  // Faire confiance au proxy Nginx
  app.set('trust proxy', 1);

  // Middlewares
  app.use(cookieParser());
  app.use(express.json());

  app.use('/auth', authRoutes);

  try {
    await AppDataSource.initialize();
    console.info('📦 Database connection successful');

    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => {
      console.info(`🚀 Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

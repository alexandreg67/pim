import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Synchronisation
  logging: false, // Activer les logs
  migrationsRun: false, // Exécuter les migrations
  entities: [`${__dirname}/../entities/**/*.{ts,js}`],
});

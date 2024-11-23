import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';
import { ProductSeeder } from './ProductSeeder';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pim_db',
  synchronize: true, // À désactiver en production
  logging: true,
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
});

async function seed() {
  try {
    console.info('🚀 Starting database seeding...');

    await AppDataSource.initialize();
    console.info('📦 Database connected');

    const seeder = new ProductSeeder(AppDataSource);

    if (process.env.CLEAN_DB === 'true') {
      await seeder.cleanDatabase();
    }

    await seeder.seed();

    console.info('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();

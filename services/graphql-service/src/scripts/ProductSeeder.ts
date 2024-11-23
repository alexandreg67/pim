import { DataSource } from 'typeorm';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { Brand } from '../entities/Brand';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { Tag } from '../entities/Tag';
import { Characteristic } from '../entities/Characteristic';
import { Image } from '../entities/Image';

export class ProductSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    await this.seedBrands();
    await this.seedCategories();
    await this.seedProducts();
  }

  private async seedBrands() {
    console.info('🏢 Seeding brands...');
    const brandsData = [
      {
        name: 'Dell',
        country: 'USA',
        logo: 'dell_logo.png',
        contactEmail: 'support@dell.com',
        phone: '+1-800-624-9897',
        description: 'Leader in personal and business computer solutions.',
      },
      {
        name: 'HP',
        country: 'USA',
        logo: 'hp_logo.png',
        contactEmail: 'support@hp.com',
        phone: '+1-800-474-6836',
        description: 'Global leader in technology and innovation.',
      },
      {
        name: 'Apple',
        country: 'USA',
        logo: 'apple_logo.png',
        contactEmail: 'support@apple.com',
        phone: '+1-800-275-2273',
        description: 'Pioneer in personal computing and mobile devices.',
      },
      {
        name: 'Samsung',
        country: 'South Korea',
        logo: 'samsung_logo.png',
        contactEmail: 'support@samsung.com',
        phone: '+82-2-2255-0114',
        description: 'Global leader in electronics and digital technology.',
      },
      {
        name: 'Seagate',
        country: 'USA',
        logo: 'seagate_logo.png',
        contactEmail: 'support@seagate.com',
        phone: '+1-800-732-4283',
        description: 'Leading manufacturer of data storage solutions.',
      },
      {
        name: 'Canon',
        country: 'Japan',
        logo: 'canon_logo.png',
        contactEmail: 'support@canon.com',
        phone: '+81-3-3758-2111',
        description:
          'World-renowned imaging and optical products manufacturer.',
      },
    ];

    for (const brandData of brandsData) {
      try {
        // Vérifie si la marque existe déjà
        const existingBrand = await Brand.findOne({
          where: { name: brandData.name },
        });

        if (!existingBrand) {
          // Créer une nouvelle instance de Brand
          const brand = new Brand();
          Object.assign(brand, brandData);
          await brand.save();
          console.info(`✅ Created brand: ${brandData.name}`);
        } else {
          // Mettre à jour la marque existante
          Object.assign(existingBrand, brandData);
          await existingBrand.save();
          console.info(`📝 Updated brand: ${brandData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error processing brand ${brandData.name}:`, error);
      }
    }

    const brandsCount = await Brand.count();
    console.info(`✨ Completed seeding ${brandsCount} brands`);
  }

  private async seedCategories() {
    console.info('📁 Seeding categories...');
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      },
      {
        name: 'Computers',
        description: 'Computers and computing devices',
      },
      {
        name: 'Printers',
        description: 'Printers and scanning devices',
      },
      {
        name: 'Storage',
        description: 'Storage devices and solutions',
      },
      {
        name: 'Accessories',
        description: 'Computer and electronic accessories',
      },
      {
        name: 'Networking',
        description: 'Networking equipment and solutions',
      },
      {
        name: 'Software',
        description: 'Software applications and tools',
      },
    ];

    for (const categoryData of categoriesData) {
      try {
        // Vérifier si la catégorie existe déjà
        const existingCategory = await Category.findOne({
          where: { name: categoryData.name },
        });

        if (!existingCategory) {
          // Créer une nouvelle instance de Category
          const category = new Category();
          Object.assign(category, categoryData);
          await category.save();
          console.info(`✅ Created category: ${categoryData.name}`);
        } else {
          // Mettre à jour la catégorie existante
          Object.assign(existingCategory, categoryData);
          await existingCategory.save();
          console.info(`📝 Updated category: ${categoryData.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error processing category ${categoryData.name}:`,
          error
        );
      }
    }

    const categoriesCount = await Category.count();
    console.info(`✨ Completed seeding ${categoriesCount} categories`);
  }

  private async seedProducts() {
    console.info('📦 Seeding products...');
    const products: { [key: string]: string }[] = [];

    await new Promise((resolve, reject) => {
      createReadStream(path.join(__dirname, '../data/products.csv'))
        .pipe(csv())
        .on('data', (data) => products.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const productData of products) {
      try {
        // Trouver la marque associée
        const brand = await Brand.findOne({
          where: { name: productData.brand },
        });

        if (!brand) continue;

        // Créer le produit
        const product = Product.create({
          name: productData.name,
          shortDescription: productData.short_description,
          description: productData.description,
          price: parseFloat(productData.price),
          brand: brand,
        });

        await product.save();

        // Créer les caractéristiques
        for (let i = 1; i <= 5; i++) {
          const label = productData[`property_${i}_label`];
          const text = productData[`property_${i}_text`];
          if (label && text) {
            await Characteristic.create({
              name: label,
              value: text,
              product,
            }).save();
          }
        }

        // Créer les images
        for (let i = 1; i <= 3; i++) {
          const src = productData[`image_${i}_src`];
          const alt = productData[`image_${i}_alt`];
          if (src) {
            await Image.create({
              url: src,
              altText: alt || `${product.name} image ${i}`,
              isPrimary: i === 1,
              product,
            }).save();
          }
        }
      } catch (error) {
        console.error(`Error seeding product ${productData.name}:`, error);
      }
    }

    const productsCount = await Product.count();
    console.info(`✅ Seeded ${productsCount} products`);
  }

  async cleanDatabase() {
    console.info('🧹 Cleaning database...');
    await Image.delete({});
    await Characteristic.delete({});
    await Product.delete({});
    await Tag.delete({});
    await Category.delete({});
    await Brand.delete({});
    console.info('✨ Database cleaned');
  }
}

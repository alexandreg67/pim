import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const ENTITIES_PATH = '/app/src/entities';
const currentUser = os.userInfo().uid;
const currentGroup = os.userInfo().gid;

async function generateEntities() {
  try {
    console.info('🚀 Starting entities generation process...');

    // Vérification PostgreSQL
    console.info('🔍 Checking PostgreSQL connection...');
    try {
      execSync(`pg_isready -h ${process.env.DB_HOST || 'postgres'} -p 5432`, {
        stdio: 'inherit',
      });
      console.info('✅ PostgreSQL is ready');
    } catch {
      throw new Error('PostgreSQL is not ready');
    }

    // Vérification du dossier entities
    if (existsSync(ENTITIES_PATH)) {
      console.info('📁 Entities folder exists, skipping generation');
      return;
    }

    // Création du dossier
    console.info('📁 Creating entities directory...');
    mkdirSync(ENTITIES_PATH, { recursive: true });

    // Génération des entités
    console.info('📝 Generating entities...');
    const command = `npx typeorm-model-generator \
      -h ${process.env.DB_HOST || 'postgres'} \
      -d ${process.env.DB_DATABASE || 'pim_db'} \
      -p 5432 \
      -u ${process.env.DB_USERNAME || 'postgres'} \
      -x ${process.env.DB_PASSWORD || 'postgres'} \
      -e postgres \
      -o ${ENTITIES_PATH} \
      --noConfig \
      --case-entities camel \
      --case-properties camel \
      --relationIds`;

    execSync(command, {
      stdio: 'inherit',
      uid: currentUser,
      gid: currentGroup,
    });

    execSync(`chmod -R 755 ${ENTITIES_PATH}/*`);
    execSync(`chown -R node:node ${ENTITIES_PATH}/*`);

    console.info('✅ Entities generated successfully');
  } catch (error) {
    console.error(
      '❌ Error:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

generateEntities();

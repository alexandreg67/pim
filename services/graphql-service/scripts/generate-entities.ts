import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const OUTPUT_DIR = path.join(__dirname, '../src/entities');

try {
  execSync(
    `npx typeorm-model-generator \
    -h localhost \
    -d pim_db \
    -p 5435 \
    -u postgres \
    -x postgres \
    -e postgres \
    -o ${OUTPUT_DIR} \
    --noConfig \
    --case-entities camel \
    --case-properties camel \
    --relationIds`,
    { stdio: 'inherit' }
  );

  console.info('✅ Entities generated successfully!');
} catch (error) {
  console.error('❌ Error generating entities:', error);
  process.exit(1);
}

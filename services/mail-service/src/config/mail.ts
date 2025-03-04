import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function createTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error(
      'SMTP configuration is missing. Check your environment variables.'
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    logger: process.env.NODE_ENV === 'development',
    debug: process.env.NODE_ENV === 'development',
  });
}

export async function testConnection() {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    console.info('✅ SMTP Connection successful');
    return true;
  } catch (error) {
    console.error('❌ SMTP Connection failed:', error);
    return false;
  }
}

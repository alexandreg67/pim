import nodemailer from 'nodemailer';

export async function createTestAccount() {
  // Pour le développement avec Ethereal
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Configuration pour la production (à compléter plus tard)
  return nodemailer.createTransport({
    // Configuration SMTP de production
  });
}

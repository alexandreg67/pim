import * as crypto from 'crypto';

export const generateTemporaryPassword = (length: number = 12): string => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  // Assurer au moins un caractère de chaque type
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz');
  password += getRandomChar('0123456789');
  password += getRandomChar('!@#$%^&*');

  // Compléter avec des caractères aléatoires
  while (password.length < length) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  // Mélanger le mot de passe
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

const getRandomChar = (charset: string): string => {
  return charset[crypto.randomInt(0, charset.length)];
};

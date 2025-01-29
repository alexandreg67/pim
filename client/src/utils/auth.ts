export const getAuthToken = (): string | null => {
  // Récupérer le token depuis les cookies
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

  return token || null;
};

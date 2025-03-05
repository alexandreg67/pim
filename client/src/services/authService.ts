import axios from 'axios';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_URL;

export const authService = {
  resetPassword: async (email: string) => {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/reset-password`,
        { email }, // Envoi du champ email
        {
          withCredentials: true, // Envoi des cookies
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe :',
        error
      );
      throw error;
    }
  },
};

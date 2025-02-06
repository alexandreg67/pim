import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

interface AuthResponse {
  user: User;
}

interface AxiosError {
  response?: {
    data: { message: string };
  };
  message: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const response = await axios.get<AuthResponse>(
      `${process.env.AUTH_SERVICE_URL}/verify`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    req.user = response.data.user;
    next();
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      'Auth verification failed:',
      axiosError.response?.data || axiosError.message
    );
    return res.status(401).json({ message: 'Invalid token' });
  }
};

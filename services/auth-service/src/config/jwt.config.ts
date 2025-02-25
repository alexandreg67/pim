if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_TOKEN_SECRET must be defined');
}

if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_REFRESH_TOKEN_SECRET must be defined');
}

export const jwtConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: '1h',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: '7d',
  },
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  },
} as const;

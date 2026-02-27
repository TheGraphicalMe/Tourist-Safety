export const jwtConfig: { secret: string; expiresIn: string } = {
  secret: process.env.JWT_SECRET || 'secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
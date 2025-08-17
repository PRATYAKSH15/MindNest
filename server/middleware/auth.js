import { verifyToken } from '@clerk/clerk-sdk-node';

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

// Middleware: Any authenticated user
export const requireAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.auth = {
      userId: decoded.sub,   // Clerk user id
      email: decoded.email,  // Optional
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

import { clerkClient } from '@clerk/clerk-sdk-node';

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
    const session = await clerkClient.sessions.verifySession(token);
    const user = await clerkClient.users.getUser(session.userId);

    req.auth = {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware: Admin only (based on email or Clerk role)
export const requireAdmin = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const session = await clerkClient.sessions.verifySession(token);
    const user = await clerkClient.users.getUser(session.userId);

    // Option 1: Check for a specific email
    const isAdminEmail = user.emailAddresses[0]?.emailAddress === 'admin@example.com';

    // Option 2: Check for a Clerk role (optional if you use roles)
    // const isAdminRole = user.publicMetadata?.role === 'admin';

    if (!isAdminEmail /* && !isAdminRole */) {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    req.auth = {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

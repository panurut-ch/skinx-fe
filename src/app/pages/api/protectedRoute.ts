import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Check if the request contains the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract the JWT token from the Authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If verification succeeds, allow access to the protected route
    return res.status(200).json({ message: 'Access granted' });
  } catch (error) {
    // If verification fails (e.g., token expired or invalid), return an authentication error
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

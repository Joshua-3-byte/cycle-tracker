import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  // Format: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request (minus the password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // move to the next function in the chain
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
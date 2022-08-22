import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      );
      req.decoded = decoded;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: true, message: 'Unauthorized access' });
    }
  } else {
    return res.status(403).json({ error: true, message: 'No token provided' });
  }
};

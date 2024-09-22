import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login'); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next(); // User is authenticated, proceed
  } catch (error) {
    return res.redirect('/login'); // Redirect to login on error
  }
};

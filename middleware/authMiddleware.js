const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login'); // not logged in
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect('/login'); // invalid or expired token
    req.user = user; // attach user info to request
    next(); // continue to the protected route
  });
}

module.exports = authenticateToken;
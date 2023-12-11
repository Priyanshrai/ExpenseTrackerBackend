const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

    const user = jwt.verify(token, '1234565');

    if (!user || !user.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const foundUser = await User.findByPk(user.userId);

    if (!foundUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = foundUser;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = {
  authenticate,
};

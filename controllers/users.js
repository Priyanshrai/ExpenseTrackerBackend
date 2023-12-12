const Sequelize = require('sequelize');
const UserDetails = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res, next) => {
  try {
   
    const { name, email, password } = req.body;

     const saltRounds = 10;
     const hash = bcrypt.hashSync(password, saltRounds);

    await UserDetails.create({ name, email, password: password });
    res.status(201).json({ message: 'Successfully created a new user' });
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, '1234565');
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserDetails.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful', token: generateAccessToken(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addUser,
  loginUser,
};

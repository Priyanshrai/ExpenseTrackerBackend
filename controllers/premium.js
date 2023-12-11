const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('sequelize');

const getPremium = async (req, res) => {
  try {
    const leaderboardofusers = await User.findAll({
      order: [['totalExpense', 'DESC']],
    });

    res.status(200).json(leaderboardofusers);
  } catch (err) {
    console.error(err);

    if (err instanceof sequelize.ValidationError) {
      // Handle validation errors
      return res.status(400).json({ success: false, message: 'Validation error', error: err.errors });
    } else if (err instanceof sequelize.DatabaseError) {
      // Handle database errors
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    } else {
      // Handle other types of errors
      return res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
    }
  }
};

module.exports = { getPremium };

const Sequelize = require("sequelize");
require('dotenv').config(); // Load environment variables from a .env file

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  // Additional Sequelize configurations can be added here
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

module.exports = sequelize;

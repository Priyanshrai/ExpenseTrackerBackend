
const sequelize=require("../util/database");
const Sequelize=require('sequelize');


const UserDetails = sequelize.define ('users',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Add unique constraint to email field
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ispremiumuser:Sequelize.BOOLEAN,
      totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue:0, // or false if it should always have a value
      }

})



module.exports = UserDetails;
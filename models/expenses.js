const Sequelize = require ('sequelize');
const sequelize = require('../util/database');
const expense = sequelize.define ('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey: true
    },
    Expenses: {
       type: Sequelize.STRING
    },
    Description : {
        type: Sequelize.STRING,
    },
    Category : {
        type:Sequelize.STRING 
    }
});

module.exports = expense;


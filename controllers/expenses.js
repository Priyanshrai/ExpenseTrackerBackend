const express = require('express');
const sequelize = require('../util/database');
const expense = require('../models/expenses');
const User = require('../models/users');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');
const logger = require('winston'); // Replace with your logger library

const downloadexpense = async (req, res) => {
  try {
    if (!req.user.ispremiumuser) {
      return res.status(401).json({ success: false, message: 'User is not a premium User' });
    }

    const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userid = req.user.id;
    const filename = `Expense${userid}/${new Date()}.txt`;
    const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
    logger.info(`File uploaded successfully: ${fileURL}`);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    logger.error('Error in downloadexpense:', err);
    res.status(500).json({ fileURL: '', success: false, error: 'Internal Server Error' });
  }
};

const addExpense = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { Expenses, Description, Category } = req.body;
    console.log("1");

    if (Expenses === undefined || Expenses.length === 0) {
      return res.status(400).json({ success: false, message: 'Parameters Missing' });
    }
    console.log("2");

    const createdExpense = await expense.create(
      {
        Expenses,
        Description,
        Category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    console.log("3");
    const totalExpense = Number(req.user.totalExpense) + Number(Expenses);

    await User.update(
      {
        totalExpense: totalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t,
      }
    );
    console.log("4");
    await t.commit();
    res.status(200).json({ newExpenseDetail: createdExpense });
    
  } catch (err) {
    await t.rollback();
    logger.error('Error in addExpense:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getExpense = async (req, res) => {
  const page = +req.query.page || 1;
  const itemsPerPage = +req.query.itemsPerPage || 10; // Default to 10 items per page
  try {
    // Fetch the total number of items in the database table
    const totalItems = await expense.count();

    const expenses = await expense.findAll({
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });

    res.status(200).json({
      allExpenses: expenses,
      currentPage: page,
      hasNextPage: itemsPerPage * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage),
    });
  } catch (error) {
    logger.error('Error in getExpense:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    if (req.params.id === undefined) {
      console.log('ID is Missing');
      return res.status(400).json({ err: 'ID is missing' });
    }

    const uId = req.params.id;

    const t = await sequelize.transaction();

    try {
      const expensetobedeleted = await expense.findAll({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      const totalExpense1 =
        Number(req.user.totalExpense) - Number(expensetobedeleted[0].Expenses);
      console.log(totalExpense1);
      req.user.totalExpense = totalExpense1;
      await req.user.save({ transaction: t });

      const noOfRows = await expense.destroy({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      if (noOfRows === 0) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Expense Doesn't Belong To User" });
      }

      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: 'Deleted Successfully' });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (err) {
    logger.error('Error in deleteExpense:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  addExpense,
  getExpense,
  deleteExpense,
  downloadexpense,
};

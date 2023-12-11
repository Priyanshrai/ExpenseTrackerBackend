const express = require("express");
const router=express.Router();

const usersController=require("../controllers/users")

router.post("/add-user", usersController.addUser)
router.post("/login-user", usersController.loginUser);
// router.delete("/delete-expense/:id", expenseController.deleteExpense);

module.exports=router;
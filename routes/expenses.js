const express=require("express");
const router=express.Router();


const expenseController=require("../controllers/expenses")
const userAuthentication = require("../middleware/auth")
router.get("/download",userAuthentication.authenticate,expenseController.downloadexpense);
router.post("/add-expense", userAuthentication.authenticate ,expenseController.addExpense);
router.get("/get-expense", userAuthentication.authenticate ,expenseController.getExpense);
router.delete("/delete-expense/:id", userAuthentication.authenticate, expenseController.deleteExpense);


module.exports=router;
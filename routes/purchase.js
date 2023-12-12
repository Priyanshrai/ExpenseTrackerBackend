const express=require("express");
const router=express.Router();

const userAuthentication = require("../middleware/auth")
const purchaseController=require("../controllers/purchase")

router.get("/premiummembership",userAuthentication.authenticate,purchaseController.purchasePremium )
router.post("/updatetransactionstatus",userAuthentication.authenticate,purchaseController.updateTransactionStatus)
router.get("/premiumstatus",userAuthentication.authenticate,purchaseController.getPremiumStatus)

module.exports=router; 
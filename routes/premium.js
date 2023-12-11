const express=require("express");
const router=express.Router();


const userAuthentication = require("../middleware/auth")
const premiumController=require("../controllers/premium")


router.get("/leaderboard",userAuthentication.authenticate,premiumController.getPremium)

module.exports=router;
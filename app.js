const express = require('express');
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const https = require('https');
//to save access logs in a file
const fs= require('fs');

var cors = require("cors");

//helmet
const helmet = require('helmet');
//compression
const compression = require('compression');
//morgan
const morgan = require('morgan');
//path
const path = require('path');

const privateKey=fs.readFileSync('server.key');
const cert=fs.readFileSync('server.cert');

//env
const dotenv = require("dotenv");
dotenv.config();

//models
const User = require("./models/users")
const Expense = require("./models/expenses")
const Order=require("./models/orders")
const Forgotpassword = require('./models/forgotPassword');

const app=express();
app.use(cors());

//routes
const expenseRoutes=require("./routes/expenses")
const userRoutes=require("./routes/users")
const orderRoutes=require("./routes/purchase")
const premiumRoutes=require("./routes/premium")
const resetPasswordRoutes = require('./routes/resetPassword')


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


//helmet
app.use(helmet());
//asset compression
app.use(compression());
//accesslogs
app.use(morgan('combined',{stream: accessLogStream}));



// app.use(bodyParser.urlencoded()); //this is for handling forms
app.use(express.json()); //this is for handling jsons



app.use('/expense',expenseRoutes);
app.use("/users",userRoutes)
app.use('/purchase',orderRoutes)
app.use("/premium",premiumRoutes)
app.use('/password', resetPasswordRoutes);

app.use((req,res)=>{
  console.log('urlll',req.url);
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

//association
User.hasMany(Expense);
Expense.belongsTo(User)


User.hasMany(Order);
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    const server = https.createServer({ key: privateKey, cert: cert }, app);
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
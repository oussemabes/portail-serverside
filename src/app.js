const express = require("express");
const app = express();
require('dotenv').config()
const cors =require('cors')
const bodyparser = require('body-parser')
app.use(cors());
app.use(express.json())

// body-parser middleware use
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))


//import routes
const authRoute=require('./Routes/auth')
const verifyTokenRoute=require('./Routes/verifytocken') 
const studiesRoute=require("./Routes/studies")
//route middlewares 
app.use('/backend/user',authRoute)
app.use('/backend/verifyToken',verifyTokenRoute)
app.use("/backend/studies",studiesRoute)

module.exports = { app };

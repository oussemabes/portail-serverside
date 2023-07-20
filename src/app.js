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

const path = require("path");



app.use(express.static(path.join(__dirname, '/public')));
//import routes
const authRoute=require('./Routes/auth')
const verifyTokenRoute=require('./Routes/verifytocken') 
const studiesRoute=require("./Routes/studies")
const particpantsRoute=require("./Routes/participants")

//route middlewares 
app.use('/backend/user',authRoute)
app.use('/backend/verifyToken',verifyTokenRoute)
app.use("/backend/studies",studiesRoute)
app.use("/backend/participants",particpantsRoute)
module.exports = { app };

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
const studiesRoute=require("./Routes/studies")
const particpantsRoute=require("./Routes/participants")
const DiseaseRoute=require("./Routes/Disease")
const HealthMeasurementRoute=require("./Routes/HealthMeasurement")
const patientRoute=require("./Routes/patient")
const UnregistredPatientRoute=require("./Routes/UnregistredPatient")

//route middlewares 
app.use('/backend/user',authRoute) 
app.use("/backend/studies",studiesRoute)
app.use("/backend/participants",particpantsRoute)
app.use("/backend/disease",DiseaseRoute)
app.use("/backend/HealthMeasurement",HealthMeasurementRoute)
app.use("/backend/patient",patientRoute)
app.use("/backend/unregistredpatient",UnregistredPatientRoute)
 


module.exports = { app };
 
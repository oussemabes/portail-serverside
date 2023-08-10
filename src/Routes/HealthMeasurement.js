const {add_Health_Measurement,get_Health_Measurement
}=require("../controllers/HealthMeasurement")
const {VerifyToken}=require("../controllers/UserController")

const express = require("express");
const router = express.Router();
router.route('/create').post(VerifyToken,(req,res)=>{
    add_Health_Measurement(req,res)
});//
router.route('/display/:user_id').get(VerifyToken,(req,res)=>{
    get_Health_Measurement(req,res)
});//

 




module.exports = router;
 
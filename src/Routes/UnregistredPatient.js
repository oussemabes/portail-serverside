const {AddUnregistredPatient
}=require("../controllers/UnregistredPatientController")

const express = require("express");
const router = express.Router();
router.route('/create').post((req,res)=>{
    AddUnregistredPatient(req,res)
});//



module.exports = router;

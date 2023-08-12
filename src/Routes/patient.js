const {Createpatient,displayPatient,displayPatientByref,countPatientOnlySecConnec,GetConnectionIdByref
}=require("../controllers/PatientController")

const express = require("express");
const router = express.Router();

router.route('/register').post((req,res)=>{
    Createpatient(req,res)
});
router.route('/displayPatient').get((req,res)=>{
    displayPatient(req,res)
});
router.route('/count').get((req,res)=>{
    countPatientOnlySecConnec(req,res)
}); 
router.route('/displayPatientByref/:ref').get((req,res)=>{
    displayPatientByref(req,res)
});

router.route('/GetConnectionIdByref/:ref').get((req,res)=>{
    GetConnectionIdByref(req,res)
});

module.exports = router;

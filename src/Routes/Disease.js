const {add_disease,getUserDiseases
}=require("../controllers/DiseaseController")
const {VerifyToken,VerifyAdmin}=require("../controllers/UserController")

const express = require("express");
const router = express.Router();
router.route('/create').post((req,res)=>{
    add_disease(req,res)
});//
router.route('/display/:user_id').get(VerifyToken,(req,res)=>{
    getUserDiseases(req,res)
});//

  

module.exports = router;
 
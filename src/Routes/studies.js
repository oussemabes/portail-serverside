const {displayStudy,createStudy,
    countStudies,
    deleteStudy,
    displayAllStudy,
    displayStudyByid
}=require("../controllers/StudyController")
const {VerifyToken,VerifyAdmin}=require("../controllers/UserController")

const express = require("express");
const router = express.Router();
router.route('/create').post(VerifyToken,VerifyAdmin,(req,res)=>{
    createStudy(req,res)
});//
router.route('/display').get(VerifyToken,VerifyAdmin,(req,res)=>{
    displayStudy(req,res)
});
router.route('/displaybyid/:study_id').get(VerifyToken,(req,res)=>{
    displayStudyByid(req,res)
});
  
router.route('/displayall').get(VerifyToken,VerifyAdmin,(req,res)=>{
    displayAllStudy(req,res)
}); 
router.route('/count').get(VerifyToken,VerifyAdmin,(req,res)=>{
    countStudies(req,res)
});
router.route('/delete/:id').delete(VerifyToken,VerifyAdmin,(req,res)=>{
    deleteStudy(req,res)
});// 

module.exports = router;

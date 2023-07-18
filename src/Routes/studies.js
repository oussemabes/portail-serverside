const {displayStudy,createStudy,
    countStudies,
    deleteStudy,
    countParticipantsBystudy,
    displayParticipantsBystudy}=require("../controllers/StudyController")
const express = require("express");
const router = express.Router();
router.route('/create').post((req,res)=>{
    createStudy(req,res)
});
router.route('/display').get((req,res)=>{
    displayStudy(req,res)
});
router.route('/count').get((req,res)=>{
    countStudies(req,res)
});
router.route('/delete').delete((req,res)=>{
    deleteStudy(req,res)
});
router.route('/countbystudy/:id').get((req,res)=>{
    countParticipantsBystudy(req,res)
});router.route('/displayParticipantsBystudy').get((req,res)=>{
    displayParticipantsBystudy(req,res)
});


module.exports = router;

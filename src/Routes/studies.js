const {displayStudy,createStudy,
    countStudies,
    deleteStudy,
}=require("../controllers/StudyController")
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
router.route('/delete/:id').delete((req,res)=>{
    deleteStudy(req,res)
});

module.exports = router;

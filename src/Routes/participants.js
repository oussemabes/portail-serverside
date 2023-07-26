const {
    countParticipantsBystudy,
    displayParticipantsBystudy,
    addParticpants,updateParticipantState,DisplayByUser,countStudiesByparticipants,countAceptedStudiesByparticipants
  } = require("../controllers/ParticipantsController");
  const {VerifyToken,VerifyAdmin}=require("../controllers/UserController")

  const express = require("express");
  const router = express.Router();
  const multer = require("multer");
  const path = require("path");
  const DIR = path.join(__dirname, "..", "/public/images/");
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(" ").join("-");
      cb(null, Date.now() + "-" + fileName);
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "application/pdf" ||
        file.mimetype == "application/msword" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(
          new Error(
            "Only .pdf, .doc, .docx formats are allowed for file upload!"
          )
        );
      }
    },
  }).single("document");//
  
  router.route('/countbystudy/:study_id').get(VerifyToken,VerifyAdmin,(req, res) => {
    countParticipantsBystudy(req, res); 
  });
  
  router.route('/displayParticipantsBystudy/:study_id').get(VerifyToken,VerifyAdmin,(req, res) => {
    displayParticipantsBystudy(req, res);
  }); 
  router.route('/countbystudies/:user_id').get(VerifyToken,(req, res) => {
    countStudiesByparticipants(req, res);
  }); 
  router.route('/countbyacceptedstudies/:user_id').get(VerifyToken,(req, res) => {
    countAceptedStudiesByparticipants(req, res);
}); 
  
  router.route('/create').post(VerifyToken,VerifyAdmin,upload, (req, res) => {
    addParticpants(req, res);
  });
  router.route('/display/:user_id').get(VerifyToken,upload, (req, res) => {
    DisplayByUser(req, res);
  });
  router.route('/update/:user_id/:study_id').patch(VerifyToken,(req, res) => {
    updateParticipantState(req, res);
  });//

  module.exports = router;
   
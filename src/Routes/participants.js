const {
    countParticipantsBystudy,
    displayParticipantsBystudy,
    addParticpants,updateParticipantState
  } = require("../controllers/ParticipantsController");
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
  }).single("file");
  
  router.route('/countbystudy/:id').get((req, res) => {
    countParticipantsBystudy(req, res);
  });
  
  router.route('/displayParticipantsBystudy/:study_id').get((req, res) => {
    displayParticipantsBystudy(req, res);
  });
  
  router.route('/create').post(upload, (req, res) => {
    addParticpants(req, res);
  });
  router.route('/update/:user_id/:study_id').put((req, res) => {
    updateParticipantState(req, res);
  });

  module.exports = router;
  
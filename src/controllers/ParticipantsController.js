const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("../config");
const path = require("path");
const fs = require("fs");
const { resolve } = require("path");
const { exist } = require("@hapi/joi");
app.use(express.static("./public"));
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//const Axios = require("axios");
 
 

async function countParticipantsBystudy(req, res) 
  {
    const study_id = req.params.study_id;
  

    const query = `SELECT COUNT(*) as count FROM participants WHERE study_id = ${study_id}`;
    try {
      await db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ error: "Error retrieving data from the database" });
    }
  }

  async function countStudiesByparticipants(req, res) 
  {
    const user_id = req.params.user_id
  
  
    const query = `SELECT COUNT(*) as count FROM participants WHERE user_id = ${user_id}`;
    try {
      await db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ error: "Error retrieving data from the database" });
    }
  }
  async function countAceptedStudiesByparticipants(req, res) 
  {
    const user_id = req.params.user_id
  
  
    const query = `SELECT COUNT(*) as count FROM participants WHERE user_id = ${user_id} AND state="accept"`;
    try {
      await db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ error: "Error retrieving data from the database" });
    }
  }

  async function DisplayByUser(req, res) 
  {
    const user_id = req.params.user_id;
    console.log("page", req.query.page, "limit", req.query.limit);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
   
    const query = `SELECT * FROM participants WHERE user_id = ${user_id} ORDER BY date Desc LIMIT ${limit} OFFSET ${offset}`;
    try {
      await db.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result); 
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ error: "Error retrieving data from the database" });
    }
  }
async function displayParticipantsBystudy(req, res) {
  const study_id = req.params.study_id;
 

  console.log(study_id);
  const query = `SELECT * FROM participants WHERE study_id = ${study_id}`;
  try {
    await db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Error retrieving data from the database" });
  }
}
function checkIfRequestExistOrAccepted(req) {
  return new Promise((resolve, reject) => {
    console.log("Checking if Request exist or accepted");
    let sqlverif = `SELECT * FROM participants WHERE user_id = ? AND (state = "pending" OR state = "accept") AND study_id = ?`;

    db.query(sqlverif, [ req.body.user_id,req.body.study_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      const exists = result.length > 0;
      resolve({ exists }); // Resolve with an object indicating if the request exists
    });
  });
}

async function addParticpants(req, res) {
  console.log(req.body.ref)
  //validate request body
  try {
    // Validate request body
    const { exists } = await checkIfRequestExistOrAccepted(req); // Pass 'req' directly here

    if (exists) {
      return res.status(400).send({ message: "Request already exist" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).send({ message: "An error occurred" });
  }
  if (!req.file) {
    return res.status(400).send("No file was uploaded.");
  }

  // Rename file to original name and move to designated folder
  const newpath = path.join(__dirname, "..", "/public/images/");
  const file = req.file;
  fs.rename(
    `${newpath}${file.filename}`,
    `${newpath}${file.originalname}`,
    (err) => {
      if (err) {
        return res.status(500).send({ message: "File upload failed" });
      }
    }
  );

  // Insert data into database
  const baseUrl = req.protocol + "://" + req.get("host");
  const imageUrl = baseUrl + "/images/" + file.originalname;
  const insertData =
    "INSERT INTO participants (ref,user_id,study_id,state,document,date) VALUES (?,?,?,?,?,?)";
  await db.query(
    insertData,
    [
      req.body.ref,
      req.body.user_id,
      req.body.study_id,
      req.body.state,
      imageUrl,
      req.body.date,
    ],
    (err, result)=>{
      
        if (err) {
          return res.status(500).send({ message: "Data insertion failed" });
        }
      }
    
  );

  return res
    .status(200)
    .send({ message: "File Uploaded and Data Inserted Successfully" });
}
async function updateParticipantState(req, res) {
  const { user_id,study_id,id } = req.params;
  const { newState } = req.body;
  

  try {
    const updateQuery = "UPDATE participants SET state = ? WHERE user_id = ? AND study_id= ? AND id=?";
    console.log(req.body.state)
    await db.query(updateQuery, [req.body.state, user_id,study_id,id]);
    
    res.status(200).json({ message: "Participant state updated successfully" });
  } catch (error) {
    console.error("Error updating participant state:", error);
    res.status(500).json({ error: "Failed to update participant state" });
  }
}

module.exports = {
  countParticipantsBystudy,
  displayParticipantsBystudy,
  addParticpants,
  updateParticipantState,
  DisplayByUser,
  countStudiesByparticipants,
  countAceptedStudiesByparticipants
};  
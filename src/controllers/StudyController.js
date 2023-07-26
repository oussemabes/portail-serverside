const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("../config");
app.use(express.static("./public"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//const Axios = require("axios");
 

function checkIfStudyExists(req) {
    return new Promise((resolve, reject) => {
      console.log("Checking if studies exists");
      let sqlverif = "SELECT * FROM studies WHERE name= ?";
  
      db.query(sqlverif, [req.body.name], (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
// Handle file uploads
async function createStudy(req, res) {
  // validate request body
  const { error } = checkIfStudyExists(req);
  if (error) {
    return res.status(400).send(error.details[0].message);
    
  }
  const data = [req.body.name, req.body.disease,req.body.discreption];
  console.log(data)
  const sql = "INSERT INTO studies (name,disease,discreption) VALUES (?,?,?)";
  const studyExists = await checkIfStudyExists(req);

    if (studyExists === false) {
      await db.query(sql, data, function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Error inserting user into the database");
        }
        res.status(200).send("study registered successfully");
      });
    } else {
      res.status(400).send("study with that information already exists");
    }
  
}
async function displayStudy(req, res) {
  console.log("page", req.query.page, "limit", req.query.limit);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
  try {
    const getData = `SELECT * FROM studies LIMIT ${limit} OFFSET ${offset}`;
    await db.query(getData, (err, result) => {
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
async function displayStudyByid(req, res) {
  const study_id=req.params.study_id


  try {
    const getData = `SELECT * FROM studies WHERE id=${study_id}`;
    await db.query(getData, (err, result) => {
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
async function displayAllStudy(req, res) {

  try {
    const getData = `SELECT * FROM studies`;
    await db.query(getData, (err, result) => {
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


async function countStudies(req, res) {
  try {
    const getCount = "SELECT COUNT(*) as count FROM studies";
    await db.query(getCount, (err, result) => {
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
async function deleteStudy(req, res) {
    const studyId = req.params.id; // Assuming study ID is provided as a parameter
  
    // Check if the study exists
    const studyExists = await checkIfStudyExists(req);
    if (!studyExists) {
      return res.status(404).send("Study not found");
    }
  
    // Delete the study from the database
    const sql = "DELETE FROM studies WHERE id = ?";
    await db.query(sql, [studyId], function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error deleting study from the database");
      }
      res.status(200).send("Study deleted successfully");
    });
  }
  



module.exports = {
  displayAllStudy,
  displayStudy,
  createStudy,
  countStudies,
  deleteStudy,
  displayStudyByid
};
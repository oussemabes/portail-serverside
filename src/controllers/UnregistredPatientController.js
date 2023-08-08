const dotenv = require("dotenv");
dotenv.config();
const jwt=require('jsonwebtoken')
const db = require("../config");
const bcrypt = require("bcryptjs");



async function AddUnregistredPatient(req, res) {
    // Validate data before creating a user

  
    // Hash the password
  
    // Create new user
    const data = [req.body.ref,req.body.disease,req.body.gender,req.body.date];
    const sql = "INSERT INTO test (ref,disease, gender,date) VALUES (?,?,?,?)";
      await db.query(sql, data, function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Error inserting patient into the database");
        }
        res.status(200).send("patient registered successfully");
      });
   
  }

  module.exports = {
    AddUnregistredPatient
  };  
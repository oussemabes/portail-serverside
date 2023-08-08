const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken')
const db = require("../config");
const bcrypt = require("bcryptjs");




async function Createpatient(req, res) {
  // Validate data before creating a user


  // Hash the password

  // Create new user
  // const data = [req.body.disease,req.body.gender,req.body.date,req.body.connection_id];
  // const updateQuery = `UPDATE patient SET disease = ?, gender = ?, date = ? WHERE connection_id = ?`;     
  // await db.query(updateQuery, data, function (err, result) {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).send("Error inserting patient into the database");
  //     }
  //     res.status(200).send("patient registered successfully");
  //   });
  await db.query(
    `SELECT disease, gender,date FROM test WHERE ref = ?`,
    [req.body.ref],
    (err, results) => {
      if (err) {
        console.error('Error fetching userdata:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'No matching userdata found' });
      }

      const { disease: fetchedDisease, gender: fetchedGender, date: fetchedDate } = results[0];

      // update the new patient into the users table
      db.query(
        `INSERT INTO patient (ref,connection_id, disease, gender,date) VALUES (?,?,?,?,?)`,
        [req.body.ref, req.body.connection_id,fetchedDisease, fetchedGender, fetchedDate],
        (err, result) => {
          if (err) {
            console.error('Error updating patient:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          return res.status(201).json({ message: 'patient created successfully' });
        }
      );
    }
  );
  ;

}
async function displayPatient(req, res) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
  try {
    const getData = `SELECT * FROM patient WHERE ref NOT IN (SELECT ref FROM users) LIMIT ${limit} OFFSET ${offset}; `;
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
async function countPatientOnlySecConnec(req, res) 
{
  


  const query = `SELECT COUNT(*) as count FROM patient WHERE ref NOT IN (SELECT ref FROM users)`;
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
async function displayPatientByref(req, res) {

  const ref=req.params.ref

  try {
    const getData = `SELECT * FROM patient WHERE ref=(Select ref FROM users WHERE id=${ref})  `;
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
module.exports = {
  Createpatient,
  displayPatient,
  displayPatientByref,
  countPatientOnlySecConnec
};   
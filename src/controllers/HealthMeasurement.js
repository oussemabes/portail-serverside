const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("../config");
app.use(express.static("./public"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// API endpoint to enter health measurements
async function add_Health_Measurement(req, res) {
    const { user_id, date, heart_beat, temperature, oxygen_saturation, blood_pressure,study_id } = req.body;
  
    if (!user_id || !date || !heart_beat || !temperature || !oxygen_saturation || !blood_pressure) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    // Check if the user has already entered health measurements for the given date
    const checkHealthMeasurementsQuery =
      'SELECT COUNT(*) as count FROM health_measurements WHERE user_id = ? AND date = ?';
  
    db.query(checkHealthMeasurementsQuery, [user_id, date], (err, result) => {
      if (err) {
        console.error('Error checking health measurements:', err);
        return res.status(500).json({ error: 'Failed to check health measurements.' });
      }
   
      const count = result[0].count;
      if (count > 0) {
        return res.status(409).json({ error: 'Health measurements already entered for the date.' });
      }
  
      // Insert new health measurements into the database
      const insertHealthMeasurementsQuery =
        'INSERT INTO health_measurements (user_id,study_id ,date, heart_beat, temperature, oxygen_saturation, blood_pressure) ' +
        'VALUES (?, ?, ?, ?, ?, ?,?)';
  
      db.query(
        insertHealthMeasurementsQuery,
        [user_id,study_id, date, heart_beat, temperature, oxygen_saturation, blood_pressure],
        (err) => {
          if (err) {
            console.error('Error inserting health measurements:', err);
            return res.status(500).json({ error: 'Failed to insert health measurements.' });
          }
  
          return res.status(201).json({ message: 'Health measurements entered successfully.' });
        }
      );
    });
  };
  async function get_Health_Measurement(req, res) {
    const { user_id } = req.params;
  
    // Add code here to query the database and retrieve all health measurements
    // for the specified user_id
    console.log("page", req.query.page, "limit", req.query.limit);
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const getData = `SELECT * FROM health_measurements  WHERE user_id=${user_id} LIMIT ${limit} OFFSET ${offset}`;
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
  };
module.exports = {
    add_Health_Measurement,
    get_Health_Measurement
};